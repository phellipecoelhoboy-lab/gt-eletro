import React, { useRef, useEffect, useState } from 'react';

// Math Interfaces
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number; // Index of start vertex
  b: number; // Index of end vertex
  type?: 'electric' | 'network' | 'automation' | 'structure';
}

interface DeviceNode {
  name: string;
  pos: Point3D;
  type: 'electric' | 'network' | 'automation';
  label: string;
  description: string;
}

interface Connection {
  from: number; // Node index
  to: number;   // Node index
  type: 'electric' | 'network' | 'automation';
}

interface Pulse {
  type: 'electric' | 'network' | 'automation';
  from: Point3D;
  to: Point3D;
  progress: number;
  speed: number;
}

interface ThreeDShowcaseProps {
  activeHoverType?: 'electric' | 'network' | 'automation' | null;
}

export const ThreeDShowcase: React.FC<ThreeDShowcaseProps> = ({ activeHoverType = null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Rotation State (in refs to prevent re-renders on animation frame updates)
  const rotation = useRef<{ x: number; y: number }>({ x: -0.3, y: 0.6 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: -0.3, y: 0.6 });
  const lastActiveTime = useRef<number>(Date.now());

  // Interactive UI tooltip state
  const [hoveredNode, setHoveredNode] = useState<DeviceNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs to sync state variables to the single-render canvas loop
  const activeHoverTypeRef = useRef(activeHoverType);
  const hoveredNodeRef = useRef(hoveredNode);
  const isDraggingRef = useRef(isDragging);

  // Sync state changes on every render
  useEffect(() => {
    activeHoverTypeRef.current = activeHoverType;
    hoveredNodeRef.current = hoveredNode;
    isDraggingRef.current = isDragging;
  });

  // 1. Define the 3D Vertices for a Modern Wireframe House
  const vertices: Point3D[] = [
    // Base/Floor (0-3)
    { x: -90, y: 60, z: -90 },
    { x: 90, y: 60, z: -90 },
    { x: 90, y: 60, z: 90 },
    { x: -90, y: 60, z: 90 },
    
    // Ceiling/Main Wall Top (4-7)
    { x: -90, y: -10, z: -90 },
    { x: 90, y: -10, z: -90 },
    { x: 90, y: -10, z: 90 },
    { x: -90, y: -10, z: 90 },
    
    // Roof Peak / Ridge line (8-9)
    { x: 0, y: -65, z: -90 },
    { x: 0, y: -65, z: 90 },

    // Front Door (10-13)
    { x: -30, y: 60, z: -90 },
    { x: -30, y: 15, z: -90 },
    { x: 10, y: 15, z: -90 },
    { x: 10, y: 60, z: -90 },

    // Front Large Window (14-17)
    { x: 30, y: 40, z: -90 },
    { x: 75, y: 40, z: -90 },
    { x: 75, y: 10, z: -90 },
    { x: 30, y: 10, z: -90 },

    // Side window left (18-21)
    { x: -90, y: 35, z: -40 },
    { x: -90, y: 35, z: 20 },
    { x: -90, y: 10, z: 20 },
    { x: -90, y: 10, z: -40 },

    // Floor outline extensions for a terrace (22-23)
    { x: -110, y: 60, z: -110 },
    { x: 110, y: 60, z: -110 },
  ];

  // 2. Define the Structural Edges of the House
  const structuralEdges: Edge[] = [
    // Base Floor perimeter
    { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 0 },
    // Ceiling perimeter
    { a: 4, b: 5 }, { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 4 },
    // Columns/Corners
    { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 },
    // Roof structure
    { a: 4, b: 8 }, { a: 5, b: 8 }, { a: 6, b: 9 }, { a: 7, b: 9 }, { a: 8, b: 9 },
    // Door
    { a: 10, b: 11 }, { a: 11, b: 12 }, { a: 12, b: 13 },
    // Front window
    { a: 14, b: 15 }, { a: 15, b: 16 }, { a: 16, b: 17 }, { a: 17, b: 14 },
    // Side window
    { a: 18, b: 19 }, { a: 19, b: 20 }, { a: 20, b: 21 }, { a: 21, b: 18 },
  ];

  // 3. Define the Device Nodes representing Smart Home equipment
  const nodes: DeviceNode[] = [
    { name: "QDC", pos: { x: -75, y: 25, z: -90 }, type: 'electric', label: 'Quadro de Distribuição Geral', description: 'Disjuntores inteligentes e proteção de surto (DPS).' },
    { name: "LED", pos: { x: 0, y: -8, z: 0 }, type: 'electric', label: 'Iluminação Automatizada', description: 'Fitas LED dimerizáveis e perfis de luz controlados por voz.' },
    { name: "SOLAR", pos: { x: 40, y: -45, z: -30 }, type: 'electric', label: 'Medidor de Energia Solar', description: 'Integração de consumo em tempo real.' },
    
    { name: "ROUTER", pos: { x: 0, y: 25, z: 0 }, type: 'network', label: 'Roteador Mesh Central', description: 'Ponto de acesso gigabit Wi-Fi 6 de ultra velocidade.' },
    { name: "MESH_POINT", pos: { x: 60, y: 25, z: 50 }, type: 'network', label: 'Nó Mesh Secundário', description: 'Extensão de rede sem perda de sinal ou latência.' },
    { name: "SWITCH", pos: { x: -60, y: 35, z: 40 }, type: 'network', label: 'Switch & Cabeamento Cat6', description: 'Conexões cabeadas gigabit para TV e escritório.' },

    { name: "ALEXA", pos: { x: -20, y: 40, z: -40 }, type: 'automation', label: 'Assistente Smart Alexa', description: 'Centralizador de comandos de voz e automações.' },
    { name: "CAMERA", pos: { x: -85, y: -5, z: -85 }, type: 'automation', label: 'Câmera Externa AI', description: 'Monitoramento por vídeo com inteligência artificial e alertas.' },
    { name: "LOCK", pos: { x: -10, y: 35, z: -90 }, type: 'automation', label: 'Fechadura Eletrônica', description: 'Abertura biométrica e monitoramento integrado por app.' }
  ];

  // 4. Connections between Nodes (to form networks)
  const connections: Connection[] = [
    // Electrical network connections
    { from: 0, to: 1, type: 'electric' }, // QDC to LED
    { from: 2, to: 0, type: 'electric' }, // Solar monitor back to QDC
    { from: 0, to: 5, type: 'electric' }, // QDC to Switch power

    // Networking connections
    { from: 3, to: 4, type: 'network' }, // Main Router to Mesh Point
    { from: 3, to: 5, type: 'network' }, // Main Router to Switch Cat6

    // Automation connections
    { from: 6, to: 3, type: 'automation' }, // Alexa commands via Wi-Fi Router
    { from: 7, to: 3, type: 'automation' }, // Camera streaming to Router
    { from: 8, to: 6, type: 'automation' }, // Smart Lock status shared with Alexa
    { from: 6, to: 1, type: 'automation' }, // Alexa controls LED light triggers
  ];

  // Helper 3D Projection function
  const projectPoint = (
    p: Point3D,
    width: number,
    height: number,
    scale: number,
    rotX: number,
    rotY: number
  ) => {
    // 1. Rotate around Y axis
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    let x1 = p.x * cosY - p.z * sinY;
    let z1 = p.x * sinY + p.z * cosY;

    // 2. Rotate around X axis
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    let y2 = p.y * cosX - z1 * sinX;
    let z2 = p.y * sinX + z1 * cosX;

    // 3. Perspective Projection calculations
    const cameraDistance = 350;
    const fov = 400; // Focal length
    const perspectiveFactor = fov / (fov + z2 + cameraDistance);
    
    return {
      x: width / 2 + x1 * scale * perspectiveFactor,
      y: height / 2 + y2 * scale * perspectiveFactor,
      zDepth: z2,
      scaleFactor: perspectiveFactor
    };
  };

  // Drag handlers to allow manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotationStart.current = { x: targetRotation.current.x, y: targetRotation.current.y };
    lastActiveTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      // Handle node hovering in 2D space
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        let foundNode: DeviceNode | null = null;
        const scale = Math.min(canvas.width, canvas.height) / 320;

        for (const node of nodes) {
          const proj = projectPoint(node.pos, canvas.width, canvas.height, scale, rotation.current.x, rotation.current.y);
          const dx = mouseX - proj.x;
          const dy = mouseY - proj.y;
          // Node hover radius
          if (Math.sqrt(dx * dx + dy * dy) < 14) {
            foundNode = node;
            setTooltipPos({ x: proj.x, y: proj.y - 12 });
            break;
          }
        }
        setHoveredNode(foundNode);
      }
      return;
    }

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    // Sensitivity factor
    const sens = 0.007;
    targetRotation.current = {
      x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationStart.current.x + dy * sens)),
      y: rotationStart.current.y + dx * sens
    };
    lastActiveTime.current = Date.now();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobiles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      rotationStart.current = { x: targetRotation.current.x, y: targetRotation.current.y };
      lastActiveTime.current = Date.now();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    const sens = 0.008;
    targetRotation.current = {
      x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationStart.current.x + dy * sens)),
      y: rotationStart.current.y + dx * sens
    };
    lastActiveTime.current = Date.now();
  };

  // Canvas loop (Runs exactly once on mount, syncing states via refs)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let pulses: Pulse[] = [];
    let pulseSpawnTimer = 0;

    // Handles canvas resizing dynamically
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        canvasRef.current.style.width = `${rect.width}px`;
        canvasRef.current.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color definitions corresponding to the UI gradients
    const colors = {
      electric: '#f59e0b',  // Gold
      network: '#06b6d4',   // Cyan
      automation: '#8b5cf6',// Violet
      structure: 'rgba(148, 163, 184, 0.15)', // Cool Grey structure
      structureHovered: 'rgba(148, 163, 184, 0.45)'
    };

    // Render loop
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      // Clear with background color gradient
      ctx.clearRect(0, 0, width, height);

      // Auto-rotation when idle
      const now = Date.now();
      if (!isDraggingRef.current && now - lastActiveTime.current > 4000) {
        // Slow lazy spin
        targetRotation.current.y += 0.0018;
      }

      // Smoothly interpolate rotation towards target directly in ref
      const speed = 0.08;
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * speed;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * speed;

      const scale = Math.min(width, height) / 320;
      const activeType = activeHoverTypeRef.current;

      // 1. Draw Structure Grid (Background floor lines first for depth)
      ctx.lineWidth = 1;
      
      // Draw grid floor helper
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
      for (let i = -120; i <= 120; i += 30) {
        // parallel to X axis
        const p1 = projectPoint({ x: i, y: 60, z: -120 }, width, height, scale, rotation.current.x, rotation.current.y);
        const p2 = projectPoint({ x: i, y: 60, z: 120 }, width, height, scale, rotation.current.x, rotation.current.y);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // parallel to Z axis
        const p3 = projectPoint({ x: -120, y: 60, z: i }, width, height, scale, rotation.current.x, rotation.current.y);
        const p4 = projectPoint({ x: 120, y: 60, z: i }, width, height, scale, rotation.current.x, rotation.current.y);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Project house vertices
      const projectedVertices = vertices.map(v => 
        projectPoint(v, width, height, scale, rotation.current.x, rotation.current.y)
      );

      // Draw structural wireframe lines
      ctx.lineWidth = 1.2;
      structuralEdges.forEach(edge => {
        const pA = projectedVertices[edge.a];
        const pB = projectedVertices[edge.b];
        
        ctx.strokeStyle = activeType 
          ? 'rgba(148, 163, 184, 0.08)' // Fade structure if one network is focused
          : colors.structure;
        
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
      });

      // 2. Manage and Draw Network Connections
      ctx.shadowBlur = 0; // reset glow
      
      connections.forEach(conn => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        const pA = projectPoint(nodeA.pos, width, height, scale, rotation.current.x, rotation.current.y);
        const pB = projectPoint(nodeB.pos, width, height, scale, rotation.current.x, rotation.current.y);

        // Styling based on active hover type
        const isActive = activeType === conn.type;
        const isFaded = activeType !== null && !isActive;

        ctx.lineWidth = isActive ? 2.5 : 1.2;
        ctx.strokeStyle = isFaded 
          ? 'rgba(255, 255, 255, 0.02)' 
          : isActive 
            ? colors[conn.type] 
            : `${colors[conn.type]}55`; // semi-transparent

        // Apply neon glow if hovered
        if (isActive) {
          ctx.shadowColor = colors[conn.type];
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // 3. Spawn and Animate Circuit Pulses
      pulseSpawnTimer++;
      const spawnInterval = activeType ? 15 : 45; // faster pulses when focused
      
      if (pulseSpawnTimer > spawnInterval) {
        pulseSpawnTimer = 0;
        
        // Pick a random connection or focused connections
        const candidates = activeType 
          ? connections.filter(c => c.type === activeType)
          : connections;

        if (candidates.length > 0) {
          const conn = candidates[Math.floor(Math.random() * candidates.length)];
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          
          pulses.push({
            type: conn.type,
            from: fromNode.pos,
            to: toNode.pos,
            progress: 0,
            speed: activeType ? 0.025 : 0.015
          });
        }
      }

      // Update and draw pulses
      pulses = pulses.filter(pulse => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) return false; // remove finished

        const pA = projectPoint(pulse.from, width, height, scale, rotation.current.x, rotation.current.y);
        const pB = projectPoint(pulse.to, width, height, scale, rotation.current.x, rotation.current.y);

        // Interpolate 2D screen coordinates
        const px = pA.x + (pB.x - pA.x) * pulse.progress;
        const py = pA.y + (pB.y - pA.y) * pulse.progress;

        const isFaded = activeType !== null && activeType !== pulse.type;

        if (!isFaded) {
          ctx.shadowColor = colors[pulse.type];
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Spark trail
          ctx.fillStyle = colors[pulse.type];
          ctx.beginPath();
          const trailLength = 0.15;
          const trailProg = Math.max(0, pulse.progress - trailLength);
          const tx = pA.x + (pB.x - pA.x) * trailProg;
          const ty = pA.y + (pB.y - pA.y) * trailProg;
          
          // Draw a gradient/faded trail line
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = colors[pulse.type];
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }

        return true;
      });
      ctx.shadowBlur = 0; // reset

      // 4. Draw Wifi signal expansion spheres (if network is active)
      if (activeType === 'network' || activeType === null) {
        const routerNode = nodes.find(n => n.name === 'ROUTER');
        if (routerNode) {
          const proj = projectPoint(routerNode.pos, width, height, scale, rotation.current.x, rotation.current.y);
          const t = (Date.now() / 2200) % 1; // 0 to 1 loop
          
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(proj.x, proj.y, t * 50 * scale, t * 25 * scale, rotation.current.y, 0, Math.PI * 2);
          ctx.stroke();

          const t2 = ((Date.now() / 2200) + 0.5) % 1;
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - t2})`;
          ctx.beginPath();
          ctx.ellipse(proj.x, proj.y, t2 * 50 * scale, t2 * 25 * scale, rotation.current.y, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. Draw Device Nodes
      nodes.forEach(node => {
        const proj = projectPoint(node.pos, width, height, scale, rotation.current.x, rotation.current.y);
        
        const isHovered = hoveredNodeRef.current === node;
        const isActiveType = activeType === node.type;
        const isFaded = activeType !== null && !isActiveType;

        // Visual radius of the node
        const r = isHovered ? 6 : isActiveType ? 5.5 : 4.5;

        // Base node glow
        if (!isFaded) {
          ctx.shadowColor = colors[node.type];
          ctx.shadowBlur = isHovered ? 14 : isActiveType ? 10 : 4;
        }

        // Draw outer ring
        ctx.strokeStyle = isFaded ? 'rgba(255, 255, 255, 0.02)' : colors[node.type];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r + 2.5, 0, Math.PI * 2);
        ctx.stroke();

        // Draw inner filled dot
        ctx.fillStyle = isFaded 
          ? 'rgba(255,255,255,0.01)' 
          : isHovered 
            ? '#ffffff' 
            : colors[node.type];
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset

        // Soft text labels in 3D for active nodes (only if focused or hovered)
        if ((isActiveType || isHovered) && !isFaded) {
          ctx.font = '500 9px Outfit';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, proj.x, proj.y - 12);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Run exactly once on mount!

  return (
    <div 
      ref={containerRef} 
      className="three-d-canvas-container"
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab' 
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Floating UI Overlay showing details on hovered node */}
      {hoveredNode && (
        <div
          className="three-d-tooltip glass"
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 30,
            padding: '10px 14px',
            borderRadius: '10px',
            minWidth: '200px',
            border: `1px solid ${
              hoveredNode.type === 'electric' 
                ? '#f59e0b55' 
                : hoveredNode.type === 'network' 
                  ? '#06b6d455' 
                  : '#8b5cf655'
            }`,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span 
            className="tooltip-type-tag"
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '4px',
              color: 
                hoveredNode.type === 'electric' 
                  ? '#f59e0b' 
                  : hoveredNode.type === 'network' 
                    ? '#06b6d4' 
                    : '#8b5cf6'
            }}
          >
            {hoveredNode.type === 'electric' 
              ? '⚡ Elétrica Premium' 
              : hoveredNode.type === 'network' 
                ? '🌐 Rede Estável' 
                : '🤖 Automação Inteligente'}
          </span>
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
            {hoveredNode.label}
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.3 }}>
            {hoveredNode.description}
          </p>
        </div>
      )}

      {/* Drag Tutorial/Helper */}
      <div 
        className="canvas-helper-badge"
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          backgroundColor: 'rgba(11, 15, 25, 0.7)',
          padding: '4px 12px',
          borderRadius: '50px',
          pointerEvents: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          userSelect: 'none'
        }}
      >
        🖱️ Arraste para girar a maquete 3D
      </div>
    </div>
  );
};

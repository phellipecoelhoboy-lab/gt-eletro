import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Wifi, 
  Home, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  ShieldCheck, 
  Star, 
  Send, 
  Sparkles, 
  Lock, 
  Clock
} from 'lucide-react';

import './App.css';
import { ThreeDShowcase } from './components/ThreeDShowcase';

// Portfolio images
import portfolioElectrical from './assets/portfolio_electrical.png';
import portfolioNetworking from './assets/portfolio_networking.png';
import portfolioAutomation from './assets/portfolio_automation.png';
import logoImg from './assets/logo_icon_hires.png';





const WHATSAPP_NUMBER = '5562992012854'; // Número real configurado

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const heroImageRef = useRef<HTMLImageElement>(null);
  
  // 3D Hover & Active network type state
  const [activeHoverType, setActiveHoverType] = useState<'electric' | 'network' | 'automation' | null>(null);

  // 3D Hover Tilt Effects for cards
  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rx = (x - rect.width / 2) / (rect.width / 2); // -1 to 1
    const ry = (y - rect.height / 2) / (rect.height / 2); // -1 to 1
    
    const maxTilt = 8; // degrees
    card.style.setProperty('--tilt-x', `${-ry * maxTilt}deg`);
    card.style.setProperty('--tilt-y', `${rx * maxTilt}deg`);
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  };

  const handleCardReset = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'electric',
    message: ''
  });

  // Force scroll to top on page load/refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Track page scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update scroll zoom on the hero image
      if (heroImageRef.current) {
        const progress = Math.min(scrollY / 800, 1);
        const scale = 1 + progress * 0.22; // zooms in up to 1.22x
        const translateY = progress * 35; // parallax movement
        heroImageRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }

      // Simple active link detection
      const sections = ['inicio', 'servicos', 'diferenciais', 'portfolio', 'contato'];
      const scrollPosition = scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Direct Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let serviceLabel = 'Serviços Elétricos';
    if (formData.serviceType === 'network') serviceLabel = 'Instalação de Rede';
    if (formData.serviceType === 'auto') serviceLabel = 'Automação Residencial';
    if (formData.serviceType === 'other') serviceLabel = 'Outros Serviços';

    let message = `Olá GT Elétrica & Automação!\n\n`;
    message += `Meu nome é *${formData.name}*.\n`;
    message += `Telefone: ${formData.phone}\n`;
    message += `Estou interessado em: *${serviceLabel}*\n\n`;
    if (formData.message) {
      message += `Mensagem: ${formData.message}`;
    } else {
      message += `Gostaria de solicitar um orçamento e agendar uma conversa técnica.`;
    }

    const encoded = encodeURIComponent(message);
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  };

  return (
    <>
      {/* Header / Navbar */}
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="logo-container">
          <img src={logoImg} alt="GT Elétrica & Automação" className="logo-img" />
          <div className="logo-text" id="site-logo">
            GT <span>Elétrica & Automação</span>
          </div>
        </div>


        <nav>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li>
              <a 
                href="#inicio" 
                className={activeSection === 'inicio' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                Início
              </a>
            </li>
            <li>
              <a 
                href="#servicos" 
                className={activeSection === 'servicos' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                Serviços
              </a>
            </li>
            <li>
              <a 
                href="#diferenciais" 
                className={activeSection === 'diferenciais' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                Diferenciais
              </a>
            </li>

            <li>
              <a 
                href="#portfolio" 
                className={activeSection === 'portfolio' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                Portfólio
              </a>
            </li>
            <li>
              <a 
                href="#contato" 
                className={activeSection === 'contato' ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>

        <a href="#contato" className="nav-btn glow-btn" id="nav-quote-btn">
          Fazer Orçamento
        </a>

        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="menu-toggle-btn"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="text-gradient-gold">Disponível para Projetos</span>
          </div>
          <h1 className="hero-title">
            Transformando sua casa em um ambiente <span className="text-gradient-brand">Conectado e Seguro</span>.
          </h1>
          <p className="hero-description">
            Serviços especializados em elétrica profissional, redes Wi-Fi de alta performance e automação inteligente (Alexa / Google) com acabamento premium e garantia.
          </p>
          <div className="hero-buttons">
            <a href="#contato" className="btn-primary glow-btn pulse-gold" id="hero-primary-cta">
              <Sparkles size={20} />
              Solicitar Orçamento
            </a>
            <a href="#contato" className="btn-secondary" id="hero-secondary-cta">
              Falar Direto no WhatsApp
              <ChevronRight size={18} />
            </a>

          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper mesh-3d-wrapper">
            <ThreeDShowcase activeHoverType={activeHoverType} />
            
            {/* Ambient glows behind the glass container */}
            <div className="hero-image-glow glow-gold"></div>
            <div className="hero-image-glow glow-cyan"></div>
            
            {/* Floating Glass Badges */}
            <div 
              className="floating-badge badge-1" 
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveHoverType('electric')}
              onMouseLeave={() => setActiveHoverType(null)}
            >
              <span className="badge-dot dot-gold"></span>
              <span>🔌 Elétrica Segura</span>
            </div>
            <div 
              className="floating-badge badge-2" 
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveHoverType('network')}
              onMouseLeave={() => setActiveHoverType(null)}
            >
              <span className="badge-dot dot-cyan"></span>
              <span>🌐 Wi-Fi Mesh Estável</span>
            </div>
            <div 
              className="floating-badge badge-3" 
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveHoverType('automation')}
              onMouseLeave={() => setActiveHoverType(null)}
            >
              <span className="badge-dot dot-violet"></span>
              <span>🤖 Automação Integrada</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="servicos" className="glass">
        <div className="section-header">
          <span className="section-tag text-gradient-gold">O que fazemos</span>
          <h2 className="section-title">Especialidades Técnicas</h2>
          <p className="section-subtitle">
            Soluções completas planejadas especificamente para resolver as necessidades da sua residência ou empresa.
          </p>
        </div>

        <div className="services-grid">
          {/* Card 1: Eletrica */}
          <div 
            className="service-card glass gold" 
            id="service-card-electric"
            onMouseEnter={() => setActiveHoverType('electric')}
            onMouseMove={handleCardTilt}
            onMouseLeave={e => {
              setActiveHoverType(null);
              handleCardReset(e);
            }}
          >
            <div className="card-glow-bg"></div>
            <div className="service-header">
              <div className="service-icon-wrapper">
                <Zap size={28} />
              </div>
              <h3>Serviço Elétrico</h3>
              <p>Segurança e conformidade técnica para sua residência.</p>
            </div>
            <ul className="service-features">
              <li><CheckCircle2 size={16} /> Instalação de luminárias e fitas LED</li>
              <li><CheckCircle2 size={16} /> Manutenção de quadros de força (DG)</li>
              <li><CheckCircle2 size={16} /> Substituição de tomadas e disjuntores</li>
              <li><CheckCircle2 size={16} /> Diagnóstico de curto-circuitos e fugas</li>
              <li><CheckCircle2 size={16} /> Infraestrutura geral e novas fiações</li>
            </ul>
            <a href="#contato" className="service-card-btn">
              Solicitar Serviço <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 2: Rede */}
          <div 
            className="service-card glass cyan" 
            id="service-card-network"
            onMouseEnter={() => setActiveHoverType('network')}
            onMouseMove={handleCardTilt}
            onMouseLeave={e => {
              setActiveHoverType(null);
              handleCardReset(e);
            }}
          >
            <div className="card-glow-bg"></div>
            <div className="service-header">
              <div className="service-icon-wrapper">
                <Wifi size={28} />
              </div>
              <h3>Rede & Wi-Fi</h3>
              <p>Velocidade máxima e cobertura total sem quedas de sinal.</p>
            </div>
            <ul className="service-features">
              <li><CheckCircle2 size={16} /> Cabeamento estruturado em Cat6 e Cat6a</li>
              <li><CheckCircle2 size={16} /> Configuração de sistemas Wi-Fi Mesh</li>
              <li><CheckCircle2 size={16} /> Organização de Racks e Switches</li>
              <li><CheckCircle2 size={16} /> Resolução de lentidão em home office</li>
              <li><CheckCircle2 size={16} /> Conectorização profissional (Keystones)</li>
            </ul>
            <a href="#contato" className="service-card-btn">
              Solicitar Serviço <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 3: Automacao */}
          <div 
            className="service-card glass violet" 
            id="service-card-automation"
            onMouseEnter={() => setActiveHoverType('automation')}
            onMouseMove={handleCardTilt}
            onMouseLeave={e => {
              setActiveHoverType(null);
              handleCardReset(e);
            }}
          >
            <div className="card-glow-bg"></div>
            <div className="service-header">
              <div className="service-icon-wrapper">
                <Home size={28} />
              </div>
              <h3>Automação Residencial</h3>
              <p>Conforto e controle total da sua casa por voz ou celular.</p>
            </div>
            <ul className="service-features">
              <li><CheckCircle2 size={16} /> Interruptores inteligentes por Wi-Fi/Zigbee</li>
              <li><CheckCircle2 size={16} /> Integração com Alexa e Google Home</li>
              <li><CheckCircle2 size={16} /> Controle automatizado de persianas e ar</li>
              <li><CheckCircle2 size={16} /> Câmeras Wi-Fi com alertas no celular</li>
              <li><CheckCircle2 size={16} /> Fechaduras eletrônicas com biometria</li>
            </ul>
            <a href="#contato" className="service-card-btn">
              Solicitar Serviço <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section id="diferenciais">
        <div className="section-header">
          <span className="section-tag text-gradient-gold">Diferenciais</span>
          <h2 className="section-title">Por que nos escolher?</h2>
          <p className="section-subtitle">
            Garantimos excelência em cada etapa, desde a escolha dos materiais até o suporte após a conclusão do projeto.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-item" id="diff-1">
            <div className="feature-icon-box">
              <Shield size={24} />
            </div>
            <h4>Materiais de Ponta</h4>
            <p>Utilização exclusiva de fios, conectores e marcas líderes de mercado para máxima durabilidade.</p>
          </div>

          <div className="feature-item" id="diff-2">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <h4>Padrão NBR 5410</h4>
            <p>Instalações executadas rigorosamente de acordo com as normas de segurança brasileiras para proteger seu patrimônio.</p>
          </div>

          <div className="feature-item" id="diff-3">
            <div className="feature-icon-box">
              <Clock size={24} />
            </div>
            <h4>Pontualidade & Limpeza</h4>
            <p>Respeito rigoroso aos prazos combinados e entrega do ambiente limpo após o serviço.</p>
          </div>

          <div className="feature-item" id="diff-4">
            <div className="feature-icon-box">
              <Lock size={24} />
            </div>
            <h4>Garantia Total</h4>
            <p>Todos os serviços executados contam com suporte pós-venda direto e garantia assegurada.</p>
          </div>
        </div>
      </section>



      {/* Portfolio Gallery Section */}
      <section id="portfolio">
        <div className="section-header">
          <span className="section-tag text-gradient-gold">Nossos Projetos</span>
          <h2 className="section-title">Padrão de Acabamento</h2>
          <p className="section-subtitle">
            Veja imagens reais e o nível de cuidado com fiação, estética e estruturação de equipamentos.
          </p>
        </div>

        <div className="portfolio-grid">
          {/* Card 1 */}
          <div 
            className="portfolio-card" 
            id="portfolio-card-1"
            onMouseMove={handleCardTilt}
            onMouseLeave={handleCardReset}
          >
            <img src={portfolioElectrical} alt="Quadro elétrico profissional" className="portfolio-image" />
            <div className="portfolio-overlay">
              <span className="portfolio-badge gold">Elétrica</span>
              <h3 className="portfolio-title">Organização de QDC</h3>
              <p className="portfolio-desc">Quadro geral estruturado e etiquetado para segurança completa.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="portfolio-card" 
            id="portfolio-card-2"
            onMouseMove={handleCardTilt}
            onMouseLeave={handleCardReset}
          >
            <img src={portfolioNetworking} alt="Rack de rede estruturado" className="portfolio-image" />
            <div className="portfolio-overlay">
              <span className="portfolio-badge cyan">Redes</span>
              <h3 className="portfolio-title">Cabeamento Estruturado</h3>
              <p className="portfolio-desc">Distribuição Gigabit em mini-rack com patch cords organizados.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="portfolio-card" 
            id="portfolio-card-3"
            onMouseMove={handleCardTilt}
            onMouseLeave={handleCardReset}
          >
            <img src={portfolioAutomation} alt="Automação residencial inteligente" className="portfolio-image" />
            <div className="portfolio-overlay">
              <span className="portfolio-badge violet">Automação</span>
              <h3 className="portfolio-title">Iluminação & Smart Home</h3>
              <p className="portfolio-desc">Living automatizado integrado por voz (Alexa) e tablet de parede.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="glass">
        <div className="section-header">
          <span className="section-tag text-gradient-gold">Feedback</span>
          <h2 className="section-title">O que dizem os clientes</h2>
          <p className="section-subtitle">
            A satisfação com a segurança e a limpeza do ambiente é nossa maior prioridade.
          </p>
        </div>

        <div className="testimonials-container">
          <div className="testimonial-card" id="testimonial-1">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="testimonial-quote">
              "Serviço impecável. O rapaz veio fazer a iluminação de LED na sala e acabou organizando meu quadro elétrico que estava um perigo. Muito profissional, limpa tudo após o término."
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">RF</div>
              <div className="testimonial-info">
                <h5>Rodrigo Fonseca</h5>
                <p>Setor Bueno, Goiânia - GO (Automação & Elétrica)</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card" id="testimonial-2">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="testimonial-quote">
              "Eu sofria muito com queda de internet no home office. Ele passou cabos Cat6 para os quartos e instalou roteadores Mesh. A casa inteira agora tem internet estável de verdade. Recomendo!"
            </p>
            <div className="testimonial-user cyan">
              <div className="testimonial-avatar">AM</div>
              <div className="testimonial-info">
                <h5>Ana Maria</h5>
                <p>Setor Oeste, Goiânia - GO (Redes de Internet)</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card" id="testimonial-3">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="testimonial-quote">
              "Automatizou minhas cortinas, ar condicionado e interruptores de luz. Ficou tudo integrado na Alexa. É fantástico! Além disso, a instalação física ficou muito limpa e bem feita."
            </p>
            <div className="testimonial-user violet">
              <div className="testimonial-avatar">GS</div>
              <div className="testimonial-info">
                <h5>Guilherme Silva</h5>
                <p>Jardim Goiás, Goiânia - GO (Smart Home)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section id="contato">
        <div className="section-header">
          <span className="section-tag text-gradient-gold">Contato</span>
          <h2 className="section-title">Vamos iniciar seu projeto?</h2>
          <p className="section-subtitle">
            Preencha o formulário para enviar um chamado direto no WhatsApp ou entre em contato pelos canais oficiais.
          </p>
        </div>

        <div className="contact-container">
          {/* Info and FAQ */}
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon-box">
                <Phone size={22} />
              </div>
              <div className="contact-details">
                <h4>WhatsApp Direto</h4>
                <p>Conversar de forma instantânea</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-gradient-gold font-bold">
                  (62) 9 9201-2854
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon-box">
                <Mail size={22} />
              </div>
              <div className="contact-details">
                <h4>E-mail Profissional</h4>
                <p>Para envio de plantas ou solicitações formais</p>
                <a href="mailto:eletricidade.gt@gmail.com" className="text-gradient-gold">
                  eletricidade.gt@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon-box">
                <MapPin size={22} />
              </div>
              <div className="contact-details">
                <h4>Região de Atendimento</h4>
                <p>Goiânia - GO</p>
              </div>
            </div>

            <div className="faq-box">
              <h3 className="faq-title">Perguntas Frequentes</h3>
              <div className="faq-item">
                <h5 className="faq-question">Vocês cobram taxa de visita técnica?</h5>
                <p className="faq-answer">Para orçamentos ou visitas técnicas de validação inicial em Goiânia, a visita é gratuita.</p>
              </div>
              <div className="faq-item">
                <h5 className="faq-question">Vocês fornecem nota fiscal dos serviços?</h5>
                <p className="faq-answer">Sim! Emitimos nota fiscal eletrônica (NFe) de prestação de serviços para todos os clientes residenciais e comerciais.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card glass" id="contact-form-block">
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="name-input">Seu Nome completo</label>
                <input 
                  type="text" 
                  id="name-input" 
                  required 
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone-input">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  id="phone-input" 
                  required 
                  placeholder="Ex: (62) 99201-2854"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>


              <div className="form-group">
                <label htmlFor="service-select">Serviço Principal Desejado</label>
                <select 
                  id="service-select"
                  value={formData.serviceType}
                  onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="electric">🔌 Instalação / Manutenção Elétrica</option>
                  <option value="network">🌐 Instalação de Rede de Internet / Mesh</option>
                  <option value="auto">🤖 Automação Residencial (Alexa/Smart)</option>
                  <option value="other">Outros / Combinação de Serviços</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message-textarea">Detalhes do Serviço (Opcional)</label>
                <textarea 
                  id="message-textarea" 
                  rows={4} 
                  placeholder="Descreva brevemente o que você precisa..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="form-btn-submit" id="submit-contact-form">
                <Send size={18} />
                Solicitar Contato no WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        className="whatsapp-float pulse-whatsapp" 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        id="floating-whatsapp-trigger"
      >
        <Phone size={28} />
        <span className="whatsapp-tooltip">Fale com GT Elétrica</span>
      </a>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-container" style={{ padding: 0 }}>
              <img src={logoImg} alt="GT Elétrica & Automação" className="logo-img" />
              <div className="logo-text">GT <span>Elétrica & Automação</span></div>
            </div>

            <p>
              Instalações elétricas profissionais, automação inteligente e cabeamento de redes estruturadas para modernizar seu dia a dia.
            </p>
            <div className="footer-socials">
              <a 
                href="https://www.instagram.com/gteletricidad?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn instagram"
                aria-label="Instagram"
                id="footer-instagram-btn"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn whatsapp"
                aria-label="WhatsApp"
                id="footer-whatsapp-btn"
              >
                <Phone size={20} />
              </a>
              <a 
                href="mailto:eletricidade.gt@gmail.com" 
                className="social-btn email"
                aria-label="E-mail"
                id="footer-email-btn"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Nossos Serviços</h4>
            <ul className="footer-links">
              <li><a href="#servicos">Elétrica Geral</a></li>
              <li><a href="#servicos">Cabeamento Cat6</a></li>
              <li><a href="#servicos">Sistemas Mesh</a></li>
              <li><a href="#servicos">Alexa & Smart Home</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Navegação</h4>
            <ul className="footer-links">
              <li><a href="#inicio">Início</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#portfolio">Projetos</a></li>
              <li><a href="#contato">Fale Conosco</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GT Elétrica & Automação. Todos os direitos reservados.</p>
          <p>Desenvolvido com padrão de excelência.</p>
        </div>
      </footer>
    </>
  );
}

export default App;


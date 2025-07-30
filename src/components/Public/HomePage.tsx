import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Star, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { isAuthenticated } = useAuth();
  const { tasks, agents, enterprises } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Statistiques en temps réel
  const stats = {
    agents: agents.length,
    enterprises: enterprises.length,
    tasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length
  };

  // Témoignages
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Freelance Designer",
      content: "Cette plateforme m'a permis de trouver des missions passionnantes et de développer mon portfolio. Les paiements sont transparents et sécurisés.",
      rating: 5,
      avatar: "👩‍🎨"
    },
    {
      name: "Thomas Martin",
      role: "CEO TechStart",
      content: "Nous avons trouvé des talents exceptionnels pour nos projets. La qualité du travail et la communication sont excellentes.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Sarah Johnson",
      role: "Développeuse Web",
      content: "Interface intuitive, paiements rapides, et une communauté active. Je recommande vivement !",
      rating: 5,
      avatar: "👩‍💻"
    }
  ];

  // FAQ
  const faqItems = [
    {
      question: "Comment fonctionne la plateforme ?",
      answer: "Les entreprises publient des tâches, les freelances postulent, et une fois sélectionnés, ils exécutent le travail et soumettent des preuves. Le paiement se fait de manière transparente avec preuves."
    },
    {
      question: "Comment sont sécurisés les paiements ?",
      answer: "Nous utilisons un système de paiement manuel avec preuves. L'entreprise déclare le paiement avec une preuve, et l'agent confirme la réception. En cas de litige, nos administrateurs interviennent."
    },
    {
      question: "Quels types de tâches puis-je trouver ?",
      answer: "Design, développement web, rédaction, marketing digital, traduction, et bien d'autres domaines. Les tâches varient en complexité et en budget."
    },
    {
      question: "Comment devenir partenaire entreprise ?",
      answer: "Créez un compte entreprise, complétez votre profil, et commencez à publier des tâches. Notre équipe valide les comptes pour assurer la qualité."
    },
    {
      question: "Y a-t-il des frais de commission ?",
      answer: "Actuellement, la plateforme est gratuite. Nous prévoyons d'intégrer un système de paiement automatisé avec des frais minimes à l'avenir."
    }
  ];

  const handleLoginRedirect = () => {
    setCurrentPage('login');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FreelanceHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('about')}
                className="text-gray-600 hover:text-gray-900"
              >
                À propos
              </button>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    S'inscrire
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <span>Se connecter</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connectez talents et opportunités
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            La plateforme qui révolutionne la collaboration entre freelances et entreprises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLoginRedirect}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Notre communauté en chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.agents}</div>
              <div className="text-gray-600">Freelances actifs</div>
            </div>
            <div className="text-center">
              <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.enterprises}</div>
              <div className="text-gray-600">Entreprises partenaires</div>
            </div>
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.tasks}</div>
              <div className="text-gray-600">Tâches publiées</div>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.completedTasks}</div>
              <div className="text-gray-600">Missions accomplies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir FreelanceHub ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paiements sécurisés</h3>
              <p className="text-gray-600">
                Système de paiement transparent avec preuves et validation mutuelle
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté active</h3>
              <p className="text-gray-600">
                Des milliers de freelances et entreprises qui collaborent quotidiennement
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité garantie</h3>
              <p className="text-gray-600">
                Système d'évaluation et de feedback pour assurer la qualité des collaborations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ce que disent nos utilisateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex">{renderStars(testimonial.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à rejoindre notre communauté ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Commencez dès aujourd'hui et découvrez de nouvelles opportunités
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 mx-auto"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400">
                La plateforme qui connecte talents et opportunités
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">À propos</button></li>
                <li><button className="hover:text-white">Comment ça marche</button></li>
                <li><button className="hover:text-white">Sécurité</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Centre d'aide</button></li>
                <li><button className="hover:text-white">Contact</button></li>
                <li><button className="hover:text-white">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white">Conditions d'utilisation</button></li>
                <li><button className="hover:text-white">Politique de confidentialité</button></li>
                <li><button className="hover:text-white">Mentions légales</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FreelanceHub. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 
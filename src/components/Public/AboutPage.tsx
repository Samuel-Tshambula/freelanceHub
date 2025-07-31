import { Briefcase, Target, Heart, ArrowLeft, Globe, Award, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
  const { isAuthenticated } = useAuth();
  const team = [
    {
      name: "Samuel Tshambula",
      role: "Fondateur & CEO",
      bio: "Passionné par l'innovation technologique et l'économie collaborative. Samuel a créé FreelanceHub pour démocratiser l'accès au travail freelance.",
      avatar: "👨‍💼",
      skills: ["Leadership", "Innovation", "Tech"]
    },
    {
      name: "Marie Dubois",
      role: "Directrice Produit",
      bio: "Experte en expérience utilisateur et en développement produit. Marie s'assure que notre plateforme répond aux besoins de tous nos utilisateurs.",
      avatar: "👩‍💻",
      skills: ["UX/UI", "Product Management", "Design"]
    },
    {
      name: "Thomas Martin",
      role: "Directeur Technique",
      bio: "Architecte logiciel expérimenté, Thomas supervise le développement technique et l'innovation de notre plateforme.",
      avatar: "👨‍🔧",
      skills: ["Architecture", "Développement", "DevOps"]
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Confiance",
      description: "Nous construisons des relations durables basées sur la transparence et la confiance mutuelle."
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Inclusion",
      description: "Notre plateforme est ouverte à tous, sans discrimination, pour créer des opportunités équitables."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Excellence",
      description: "Nous encourageons et récompensons l'excellence dans chaque collaboration."
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Innovation",
      description: "Nous repoussons constamment les limites pour améliorer l'expérience de nos utilisateurs."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header pour utilisateurs non connectés */}
      {!isAuthenticated && (
        <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FreelanceHub</span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Accueil
                </button>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 ${!isAuthenticated ? 'pt-36' : 'pt-20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À propos de FreelanceHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Notre mission est de révolutionner la façon dont les talents et les entreprises collaborent
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-12 w-12 text-blue-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">Notre Vision</h2>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                Nous imaginons un monde où chaque talent peut trouver sa place et chaque entreprise peut accéder aux compétences dont elle a besoin, sans barrières géographiques ou organisationnelles.
              </p>
              <p className="text-gray-600">
                FreelanceHub aspire à devenir la plateforme de référence pour la collaboration freelance, en créant un écosystème où la qualité, la transparence et l'innovation sont au cœur de chaque interaction.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <Briefcase className="h-12 w-12 text-green-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">Notre Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                Connecter les talents aux opportunités en créant une plateforme transparente, sécurisée et innovante qui facilite la collaboration entre freelances et entreprises.
              </p>
              <p className="text-gray-600">
                Nous nous engageons à fournir les outils et l'environnement nécessaires pour que chaque collaboration soit un succès, en mettant l'accent sur la qualité, la sécurité et l'expérience utilisateur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Notre Histoire
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2023 - La Genèse</h3>
                  <p className="text-gray-600">
                    FreelanceHub est né d'une vision simple : créer une plateforme qui démocratise l'accès au travail freelance. 
                    Face aux défis de l'économie moderne, nous avons identifié le besoin d'une solution transparente et sécurisée.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2024 - Le Développement</h3>
                  <p className="text-gray-600">
                    Après des mois de développement et de tests, nous avons lancé la première version de notre plateforme. 
                    L'accent a été mis sur la simplicité d'utilisation et la sécurité des transactions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aujourd'hui - L'Expansion</h3>
                  <p className="text-gray-600">
                    Notre communauté grandit chaque jour. Nous continuons d'innover et d'améliorer notre plateforme 
                    pour répondre aux besoins évolutifs de nos utilisateurs et créer un écosystème encore plus robuste.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Notre Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez notre mission
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Ensemble, créons un avenir où chaque talent trouve sa place
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Commencer maintenant
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
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white">Accueil</button></li>
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

export default AboutPage; 
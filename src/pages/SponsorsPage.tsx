import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Star, TrendingUp, Users, Globe, Heart } from 'lucide-react';

// Mock sponsor data
const sponsors = [
  {
    id: 1,
    name: 'Orange Sénégal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2560px-Orange_logo.svg.png',
    category: 'Platinum',
    description: 'Principal sponsor de la Basketball University League, Orange Sénégal soutient activement le développement du basketball universitaire.',
    benefits: ['Sponsor Principal', 'Couverture Média', 'Présence Digitale', 'Événements Exclusifs']
  },
  {
    id: 2,
    name: 'SONATEL',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sonatel_logo.svg/2560px-Sonatel_logo.svg.png',
    category: 'Gold',
    description: 'Partenaire technologique de la BUL, SONATEL apporte son expertise en connectivité et solutions digitales.',
    benefits: ['Connectivité', 'Solutions Digitales', 'Support Technique', 'Innovation']
  },
  {
    id: 3,
    name: 'Air Sénégal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Air_S%C3%A9n%C3%A9gal_Logo.svg/2560px-Air_S%C3%A9n%C3%A9gal_Logo.svg.png',
    category: 'Gold',
    description: 'Transporteur officiel de la BUL, Air Sénégal assure le déplacement des équipes et du personnel.',
    benefits: ['Transport Officiel', 'Logistique', 'Voyages Équipes', 'Support Événementiel']
  },
  {
    id: 4,
    name: 'WAVE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Wave_Money_Logo.svg/2560px-Wave_Money_Logo.svg.png',
    category: 'Silver',
    description: 'Partenaire financier de la BUL, WAVE facilite les transactions et le paiement des bourses aux joueurs.',
    benefits: ['Solutions de Paiement', 'Bourses Étudiants', 'Transactions Sécurisées', 'Support Financier']
  },
  {
    id: 5,
    name: 'Decathlon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png',
    category: 'Silver',
    description: 'Fournisseur officiel d\'équipements sportifs de la BUL, Decathlon équipe les équipes et les arbitres.',
    benefits: ['Équipements Sportifs', 'Matériel Officiel', 'Support Technique', 'Formation']
  },
  {
    id: 6,
    name: 'Canal+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Canal%2B_Logo.svg/2560px-Canal%2B_Logo.svg.png',
    category: 'Media',
    description: 'Diffuseur officiel des matchs de la BUL, Canal+ assure une couverture médiatique de qualité.',
    benefits: ['Diffusion TV', 'Couverture Média', 'Contenu Exclusif', 'Promotion']
  }
];

const benefits = [
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Visibilité Premium',
    description: 'Exposition maximale de votre marque à travers tous nos canaux de communication.'
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Accès Exclusif',
    description: 'Accès privilégié aux événements et opportunités de networking avec les leaders du sport.'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Croissance de Marque',
    description: 'Augmentez votre notoriété auprès d\'une audience jeune et dynamique.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Engagement Communautaire',
    description: 'Participez au développement du basketball universitaire au Sénégal.'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Portée Nationale',
    description: 'Atteignez une audience nationale à travers nos différentes plateformes.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Impact Social',
    description: 'Contribuez à la formation et au développement des jeunes talents.'
  }
];

const SponsorsPage: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative bg-navy-900 text-white py-20 overflow-hidden"
        style={{ y }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-navy-900 to-crimson-900 opacity-50"
          style={{ opacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nos Sponsors
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Découvrez nos partenaires qui soutiennent activement le développement du basketball universitaire au Sénégal.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">Pourquoi Nous Rejoindre ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-crimson-500 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sponsors Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">Nos Partenaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, rotateY: 5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="h-24 flex items-center justify-center mb-6">
                    <motion.img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
                    style={{
                      backgroundColor: sponsor.category === 'Platinum' ? '#E5E7EB' : 
                                     sponsor.category === 'Gold' ? '#FEF3C7' :
                                     sponsor.category === 'Silver' ? '#DBEAFE' : '#F3F4F6',
                      color: sponsor.category === 'Platinum' ? '#374151' :
                            sponsor.category === 'Gold' ? '#92400E' :
                            sponsor.category === 'Silver' ? '#1E40AF' : '#4B5563'
                    }}
                  >
                    {sponsor.category}
                  </motion.div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{sponsor.name}</h3>
                  <p className="text-gray-600 mb-4">{sponsor.description}</p>
                  <div className="space-y-2">
                    {sponsor.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-crimson-500 mr-2" />
                        {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Devenez Partenaire</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau de partenaires et contribuez au développement du basketball universitaire au Sénégal.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-crimson-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-crimson-600 transition-colors"
          >
            Contactez-nous
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SponsorsPage; 
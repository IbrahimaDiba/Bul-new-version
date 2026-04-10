import React from "react";

const CookiePolicyPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-4">Politique de Cookies</h1>
    <p>
      Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic.
      Les cookies sont de petits fichiers texte stockés sur votre appareil.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Types de cookies utilisés</h2>
    <ul className="list-disc ml-6">
      <li>Cookies essentiels : nécessaires au fonctionnement du site.</li>
      <li>Cookies analytiques : pour mesurer l'audience et améliorer le service.</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">Gestion des cookies</h2>
    <p>
      Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti lors de leur utilisation.
      Cependant, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
    </p>
    <p className="mt-6 text-sm text-gray-500">
      Dernière mise à jour : juin 2024
    </p>
  </div>
);

export default CookiePolicyPage; 
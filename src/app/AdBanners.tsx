"use client";

import React, { useEffect, useState } from 'react';
import styles from './styles/AdBanners.module.css';

interface AdBanner {
  id: number;
  title: string;
  desc: string;
  cta: string;
  image: string;
  bg?: string;
}

const AdBanners: React.FC = () => {
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdBanner | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      const response = await fetch('/ads.json');
      const data = await response.json();
      setAds(data);
    };

    fetchAds();
  }, []);

  const handleEditClick = (ad: AdBanner) => {
    setSelectedAd(ad);
    setShowEditSheet(true);
  };

  const handleSaveChanges = (updatedAd: AdBanner) => {
    setAds((prevAds) => prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)));
    setShowEditSheet(false);
  };

  return (
    <div className={styles.adBanners}>
    {ads.map((ad, index) => (
      <div key={ad.id} className={styles.adBanner}>
        <img src={ad.image} alt={ad.title}  className={styles.adBannerimg}/>         
          <img src={ad.bg}  className={`${styles.adBg} ${styles[`adBg${index}`]}`} />
          <h3 className={`${styles.adTitle} ${styles[`adTitle${index}`]}`}>{ad.title}</h3>
          <p className={`${styles.adDesc} ${styles[`adDesc${index}`]}`}>{ad.desc}</p>
          <button className={`${styles.adButton} ${styles[`adButton${index}`]}`}>{ad.cta}</button>
        
        <button className={styles.editButton} onClick={() => handleEditClick(ad)}>✏️</button>
      </div>
    ))}
    {showEditSheet && selectedAd && (
      <EditAdSheet ad={selectedAd} onSave={handleSaveChanges} onClose={() => setShowEditSheet(false)} />
    )}
  </div>
  
  );
};

export default AdBanners;

interface EditAdSheetProps {
  ad: AdBanner;
  onSave: (updatedAd: AdBanner) => void;
  onClose: () => void;
}

const EditAdSheet: React.FC<EditAdSheetProps> = ({ ad, onSave, onClose }) => {
  const [title, setTitle] = useState(ad.title);
  const [desc, setDesc] = useState(ad.desc);
  const [cta, setCta] = useState(ad.cta);
  const [image, setImage] = useState(ad.image);
  const [bg, setBg] = useState(ad.bg);

  const handleSave = () => {
    const updatedAd = { ...ad, title, desc, cta, image, bg };
    onSave(updatedAd);
  };

  return (
    <div className={styles.editSheet}>
      <h2>Edit Banner</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </label>
      <label>
        Call to Action:
        <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} />
      </label>
      <label>
        Background Image URL:
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      </label>
      <label>
      Image URL:
        <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

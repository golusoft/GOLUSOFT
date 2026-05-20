export interface SizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  group: 'social' | 'profile' | 'thumbnail' | 'document' | 'misc';
}

export const SIZE_PRESETS: SizePreset[] = [
  // Social
  { id: 'instagram-square', label: 'Instagram Square', width: 1080, height: 1080, group: 'social' },
  { id: 'instagram-portrait', label: 'Instagram Portrait', width: 1080, height: 1350, group: 'social' },
  { id: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920, group: 'social' },
  { id: 'whatsapp-dp', label: 'WhatsApp Profile', width: 500, height: 500, group: 'social' },
  { id: 'whatsapp-status', label: 'WhatsApp Status', width: 1080, height: 1920, group: 'social' },
  { id: 'facebook-post', label: 'Facebook Post', width: 1200, height: 630, group: 'social' },
  { id: 'facebook-cover', label: 'Facebook Cover', width: 820, height: 312, group: 'social' },
  { id: 'twitter-post', label: 'Twitter / X Post', width: 1200, height: 675, group: 'social' },
  { id: 'twitter-header', label: 'Twitter / X Header', width: 1500, height: 500, group: 'social' },
  { id: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627, group: 'social' },
  { id: 'linkedin-banner', label: 'LinkedIn Banner', width: 1584, height: 396, group: 'social' },
  // Thumbnails
  { id: 'youtube-thumb', label: 'YouTube Thumbnail', width: 1280, height: 720, group: 'thumbnail' },
  { id: 'youtube-banner', label: 'YouTube Banner', width: 2560, height: 1440, group: 'thumbnail' },
  { id: 'pinterest', label: 'Pinterest Pin', width: 1000, height: 1500, group: 'thumbnail' },
  // Profile / passport
  { id: 'passport-india', label: 'Passport (India) 35x45mm', width: 413, height: 531, group: 'profile' },
  { id: 'passport-us', label: 'US Passport 2x2"', width: 600, height: 600, group: 'profile' },
  { id: 'passport-uk', label: 'UK Passport', width: 413, height: 531, group: 'profile' },
  { id: 'visa', label: 'Visa Photo', width: 600, height: 600, group: 'profile' },
  // Document
  { id: 'a4-300dpi', label: 'A4 @ 300 DPI', width: 2480, height: 3508, group: 'document' },
  { id: 'a4-150dpi', label: 'A4 @ 150 DPI', width: 1240, height: 1754, group: 'document' },
  { id: 'letter-300dpi', label: 'Letter @ 300 DPI', width: 2550, height: 3300, group: 'document' },
  // Misc
  { id: 'hd', label: '720p HD', width: 1280, height: 720, group: 'misc' },
  { id: 'fhd', label: '1080p Full HD', width: 1920, height: 1080, group: 'misc' },
  { id: '4k', label: '4K UHD', width: 3840, height: 2160, group: 'misc' },
];

export const PRESET_GROUP_LABELS: Record<SizePreset['group'], string> = {
  social: 'Social media',
  profile: 'Passport / ID / Profile',
  thumbnail: 'Thumbnails & banners',
  document: 'Document sizes',
  misc: 'Standard resolutions',
};

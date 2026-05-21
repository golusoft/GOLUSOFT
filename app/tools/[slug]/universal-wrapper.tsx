'use client';

import { UniversalToolClient } from '@/components/universal-tool-client';
import { getToolUIConfig } from '@/lib/tool-settings';

export function UniversalWrapper({ slug }: { slug: string }) {
  const config = getToolUIConfig(slug);

  return (
    <UniversalToolClient
      slug={slug}
      accept={config.accept}
      multiple={config.multiple}
      settings={config.settings}
      maxSize={config.maxSize}
      uploadLabel={config.uploadLabel}
      uploadHint={config.uploadHint}
      processLabel={config.processLabel}
    />
  );
}

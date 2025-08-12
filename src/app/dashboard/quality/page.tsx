import HeadQuality from '@/components/dashboard/quality/headQuality'
import QualityScoreUI from '@/components/dashboard/quality/qualityScoreUI'
import React from 'react'
import { config } from '@/config';
export const metadata = { title: `Quality | Dashboard | ${config.site.name}` };

function page(): React.JSX.Element {
  return (
    <div>

      <HeadQuality />
      {/* Additional content for the Quality page can go here */}
      <QualityScoreUI />
    </div>
  )
}

export default page
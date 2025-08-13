import HeadQuality from '@/components/dashboard/quality/head-quality'
import QualityScoreUI from '@/components/dashboard/quality/quality-score-ui'
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
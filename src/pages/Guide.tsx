import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { BookOpen, Calculator, Info } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function Guide() {
  useEffect(() => {
    trackEvent('guide_viewed');
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">METHODOLOGY & GUIDE</h1>
        <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">How True Cost Per Hour is Calculated</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">The "True Cost" Blend: Estimated vs. Actual</h2>
        <p className="text-slate-600">
          Most tractor cost calculators give you a one-time estimate based on industry averages. Tractor takes a different approach. We start with those same industry-standard formulas (based on ASABE standards) so you have a baseline from day one. 
        </p>
        <p className="text-slate-600">
          However, as you log real fuel fill-ups and real maintenance records, Tractor progressively replaces those estimates with your actual operating costs. This means your Cost Per Hour becomes more accurate the more you use the app.
        </p>
      </section>

      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <CardTitle>The ASABE Standard Formulas (Estimated Mode)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <p>When you haven't logged any data yet, we use the following standard formulas to estimate your costs:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Fuel Cost/Hour:</strong> <code>Horsepower × 0.044 (diesel multiplier) × Fuel Price/Gallon</code></li>
            <li><strong>Repair Cost/Hour:</strong> <code>(Purchase Price × 0.0084)</code> (Roughly 0.84% of purchase price per 100 hours for a typical 2WD tractor)</li>
            <li><strong>Depreciation/Hour:</strong> <code>(Purchase Price − Salvage Value) / Expected Life Hours</code></li>
            <li><strong>Taxes, Insurance, Housing (TIH)/Hour:</strong> <code>1% of Average Value / Annual Hours</code></li>
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Worked Example</h2>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-3">
          <p>Imagine a <strong>105 HP Diesel Tractor</strong> purchased for <strong>$75,000</strong>.</p>
          <ul className="list-none space-y-1">
            <li><strong>Expected Life:</strong> 12,000 hours</li>
            <li><strong>Salvage Value:</strong> 20% ($15,000)</li>
            <li><strong>Annual Usage:</strong> 400 hours</li>
            <li><strong>Diesel Price:</strong> $3.50/gal</li>
          </ul>
          <hr className="border-slate-200 my-4" />
          <ul className="space-y-2">
            <li><strong>Fuel:</strong> 105 HP × 0.044 × $3.50 = <span className="font-mono font-bold">$16.17 / hr</span></li>
            <li><strong>Repair:</strong> $75,000 × 0.0084 = <span className="font-mono font-bold">$6.30 / hr</span></li>
            <li><strong>Depreciation:</strong> ($75,000 - $15,000) / 12,000 = <span className="font-mono font-bold">$5.00 / hr</span></li>
            <li><strong>TIH:</strong> (($75,000 + $15,000)/2 × 0.01) / 400 = <span className="font-mono font-bold">$1.13 / hr</span></li>
          </ul>
          <div className="pt-3 border-t border-slate-200 mt-3 text-lg font-bold text-slate-900 flex justify-between">
            <span>Total Estimated Cost:</span>
            <span className="font-mono">$28.60 / hr</span>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 itemProp="name" className="font-bold text-slate-800 mb-2">How much does it cost to run a tractor per hour?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text" className="text-sm text-slate-600">It varies widely based on horsepower, age, and usage, but a typical mid-size utility tractor (75-100 HP) often costs between $20 and $35 per hour to operate when factoring in fuel, repairs, and depreciation. Our tool helps you nail down your exact number based on your specific machine.</p>
            </div>
          </div>
          
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 itemProp="name" className="font-bold text-slate-800 mb-2">How is tractor depreciation calculated?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text" className="text-sm text-slate-600">We use a straight-line depreciation method over the expected life of the machine in hours. You take the initial purchase price, subtract the expected salvage value (what you can sell it for at the end of its life, typically ~20%), and divide that by the expected life in hours (often 10,000 to 12,000 hours).</p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 itemProp="name" className="font-bold text-slate-800 mb-2">How often should tractor maintenance be logged, by hours or by calendar time?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text" className="text-sm text-slate-600">Tractor maintenance should primarily be logged and tracked by engine hours, as this accurately reflects the wear and tear on the machine. Calendar time is only relevant for fluids that degrade over time (like changing oil annually if you don't hit the hour mark). Our dashboard specifically tracks service intervals by hours.</p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 itemProp="name" className="font-bold text-slate-800 mb-2">What's a reasonable annual maintenance budget for a mid-size tractor?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text" className="text-sm text-slate-600">Research shows that typical annual maintenance costs range from $300 to $1,000 per year for a mid-size tractor, depending heavily on annual usage (hours) and the age of the machine. Logging your real parts and labor costs is the only way to know your true budget.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hidden FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "How much does it cost to run a tractor per hour?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It varies widely based on horsepower, age, and usage, but a typical mid-size utility tractor (75-100 HP) often costs between $20 and $35 per hour to operate when factoring in fuel, repairs, and depreciation."
            }
          }, {
            "@type": "Question",
            "name": "How is tractor depreciation calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use a straight-line depreciation method over the expected life of the machine in hours. You take the initial purchase price, subtract the expected salvage value, and divide that by the expected life in hours."
            }
          }]
        }
      `}} />
    </div>
  );
}

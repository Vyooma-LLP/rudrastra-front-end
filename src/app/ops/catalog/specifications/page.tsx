import React from 'react';
import { db } from '@/db';
import { categories, specDefinitions } from '@/db/schema';
import { SpecificationManager } from './SpecificationManager';

export default async function SpecificationAnalysisPage() {
  const allCategories = await db.select().from(categories);
  const allSpecs = await db.select().from(specDefinitions);

  return (
    <SpecificationManager initialCategories={allCategories} initialSpecs={allSpecs} />
  );
}

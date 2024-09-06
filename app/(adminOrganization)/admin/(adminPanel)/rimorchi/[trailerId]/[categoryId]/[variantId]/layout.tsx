import { GetCategoryById, GetTrailerById, GetVariantyById } from '@/data/trailer'
import { notFound } from 'next/navigation';
import React from 'react'

async function layout({params: {trailerId, categoryId, variantId}, children} : {params: {trailerId: string, categoryId: string, variantId: string}, children: React.ReactNode}) {

  const trailer = await GetTrailerById(trailerId);

  if(!trailer){
    notFound();
  }

  const category = await GetCategoryById(categoryId);

  if(!category){
    notFound();
  }

  if(category.trailerId !== trailerId){
    notFound();
  }

  const variant = await GetVariantyById(variantId);

  if(!variant){
    notFound();
  }

  if(variant.categoryId !== categoryId){
    notFound();
  }


  return <>{children}</>;
}

export default layout
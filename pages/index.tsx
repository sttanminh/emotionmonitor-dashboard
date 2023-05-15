import { Layout } from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import React from 'react';

const Page: NextPageWithLayout = () => {
  return <>
    <div>{"Hello world"}</div> 
  </>
};
 
Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  );
};
 
export default Page;

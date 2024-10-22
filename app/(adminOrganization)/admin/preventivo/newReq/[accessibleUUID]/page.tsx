import NewRequestCompoent from '@/components/admin/preventivi/accessibleUUID/new-request-component';
import React from 'react';

function Page({ params: { accessibleUUID }} : { params: { accessibleUUID: string }}) {
  return (
    <NewRequestCompoent accessibleUUID={accessibleUUID} />
  );
}

export default Page;

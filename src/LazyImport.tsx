// DynamicLoader.tsx

import React, { Suspense, ComponentType } from 'react';

interface Props {
  componentLoader: () => Promise<{ default: ComponentType<any> }>;
}

const LazyImport: React.FC<Props> = ({ componentLoader }) => {
  const Component = React.lazy(componentLoader);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default LazyImport;

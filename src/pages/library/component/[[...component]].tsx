import { getCanvasClient, getCategoryClient } from '@/utilities/canvas/canvasClients';
import { RootComponentInstance } from '@uniformdev/canvas';
import { UniformComposition } from '@uniformdev/canvas-react';
import { GetStaticPropsContext } from 'next';

type ComponentDetailPageProps = {
  composition: RootComponentInstance;
  categoryName?: string;
  description: string;
};

export default function Page({ composition, categoryName, description }: ComponentDetailPageProps) {
  return (
    <div className="mx-auto p-6 lg:text-center">
      <div className="bg-gray-200">
        <h1 className="text-base font-semibold leading-7 text-indigo-600"></h1>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{composition._name}</p>
        <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
        <p className="mt-6 text-lg leading-8 text-gray-600 text-indigo-600 font-bold">{categoryName} category</p>
      </div>
      <hr />
      <div className="p-16 ">
        <UniformComposition data={composition}></UniformComposition>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const component = params?.component?.[0];
  if (!component) {
    return null;
  }
  const canvasClient = getCanvasClient();
  const categoryClient = getCategoryClient();
  const { composition } = await canvasClient.getCompositionById({
    compositionId: component,
  });
  const { compositions } = await canvasClient.getCompositionList({ resolveData: false, skipPatternResolution: true });
  const definition = compositions.find(c => c.composition._id === component);
  const { categoryId, description } = definition || {};
  const { categories } = await categoryClient.getCategories();
  const category = categories.find(c => c.id === categoryId);
  return {
    props: {
      composition,
      categoryName: category?.name ?? 'Uncategorized',
      description: description ?? 'missing description',
    },
  };
};

export const getStaticPaths = async () => {
  const canvasClient = getCanvasClient();
  const { compositions } = await canvasClient.getCompositionList({ resolveData: false, skipPatternResolution: true });
  const patterns = compositions.filter(c => c.pattern);
  const paths = patterns.map(p => `/library/component/${p.composition._id}`);
  return { paths, fallback: false };
};

import { getCanvasClient } from '@/utilities/canvas/canvasClients';
import { RootComponentInstance } from '@uniformdev/canvas';
import Link from 'next/link';

type LibraryPage = {
  patterns: Composition[];
};

type Composition = {
  composition: RootComponentInstance;
  previewImageUrl: string;
};

export default function Page({ patterns }: LibraryPage) {
  return (
    <div className="mx-auto p-6 lg:text-center">
      <h1 className="text-base font-semibold leading-7 text-indigo-600"></h1>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your component library</p>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Explore the building blocks of your next digital experience
      </p>
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {patterns?.map(p => (
          <li key={p.composition._id} className="relative">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              {p.previewImageUrl ? (
                <img
                  src={p.previewImageUrl}
                  alt={p.composition._name}
                  className="pointer-events-none object-cover group-hover:opacity-75"
                />
              ) : null}
              <Link
                type="button"
                href={`/library/component/${p.composition._id}`}
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {p.composition._id}</span>
              </Link>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
              {p.composition._name}
            </p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">Type: {p.composition.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps = async () => {
  const canvasClient = getCanvasClient();
  const { compositions } = await canvasClient.getCompositionList({ resolveData: false, skipPatternResolution: true });
  const patterns = compositions.filter(c => c.pattern);
  return { props: { patterns } };
};

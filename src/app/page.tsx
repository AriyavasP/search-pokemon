'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      types
      image
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        types
        image
      }
    }
  }
`;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('name') || '';

  const [search, setSearch] = useState(initialSearch);
  const [input, setInput] = useState(initialSearch);

  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name: search },
    skip: !search,
    fetchPolicy: 'cache-first',
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setSearch(input.trim().toLowerCase());
    router.push(`/?name=${input.trim().toLowerCase()}`);
  };

  const handleEvolutionClick = (name: string) => {
    console.log(data);
    setInput(name.toLowerCase());
    setSearch(name.toLowerCase());
    router.push(`/?name=${name.toLowerCase()}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-black">Search Pokemon</h1>
      <form onSubmit={handleSearch} className="mb-8 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Pokemon name"
          className="text-black w-full p-4 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
        />
      </form>

      {loading && <p className="text-black">Loading...</p>}
      {error && <p className="text-black">Error: {error.message}</p>}

      {data && data.pokemon ? (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl text-black">
          <div className="flex items-center mb-6">
            <Image
              src={data.pokemon.image}
              alt={data.pokemon.name}
              width={150}
              height={150}
              className="rounded-full border border-gray-300"
            />
            <div className="ml-6">
              <h2 className="text-3xl font-bold">
                {data.pokemon.name} (#{data.pokemon.number})
              </h2>
              <p className="mt-2">
                <span className="font-semibold">Type:</span>{' '}
                {data.pokemon.types.join(', ')}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Fast Attacks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.pokemon.attacks.fast.map((attack: any) => (
                <div
                  key={attack.name}
                  className="p-4 border rounded-md bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Name:</span> {attack.name}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {attack.type}
                  </p>
                  <p>
                    <span className="font-semibold">Damage:</span> {attack.damage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Special Attacks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.pokemon.attacks.special.map((attack: any) => (
                <div
                  key={attack.name}
                  className="p-4 border rounded-md bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Name:</span> {attack.name}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {attack.type}
                  </p>
                  <p>
                    <span className="font-semibold">Damage:</span> {attack.damage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {data.pokemon.evolutions && data.pokemon.evolutions.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Evolutions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.pokemon.evolutions.map((evolution: any) => (
                  <div
                    key={evolution.id}
                    className="p-4 border rounded-md bg-gray-50 cursor-pointer hover:shadow-md transition"
                    onClick={() => handleEvolutionClick(evolution.name)}
                  >
                    <Image
                      src={evolution.image}
                      alt={evolution.name}
                      width={100}
                      height={100}
                      className="mx-auto mb-4"
                    />
                    <p className="text-center font-semibold">
                      {evolution.name} (#{evolution.number})
                    </p>
                    <p className="text-center">
                      {evolution.types.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        search && !loading && <p className="text-black">No Pokemon found with that name.</p>
      )}
    </main>
  );
}

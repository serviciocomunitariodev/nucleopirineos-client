type PhraseItem = {
  quote: string
  author?: string
}

const phrases: PhraseItem[] = [
  {
    quote: '"La música es para todos."',
    author: 'Direccion del nucleo',
  },
  {
    quote: '"Tocar, cantar y luchar."',
    author: 'Direccion del nucleo',
  }
]

export default function PhrasesSection() {
  return (
    <section className='w-full bg-superficies py-20 landing-section' id='frases'>
      <div className='mx-auto w-full max-w-[1500px] px-4 lg:px-5'>
        <div className='grid items-stretch gap-6 md:grid-cols-2'>
          {phrases.map((item) => (
            <article
              key={item.quote}
              className='flex max-h-[200px] flex-col items-center rounded-2xl bg-transparent px-6 text-center'
            >
              <div className='flex max-h-[160px] w-full items-start justify-center'>
                <p className='text-[40px] font-bold leading-tight text-ink'>{item.quote}</p>
              </div>
              <p className='mt-auto pt-6 text-[26px] font-medium text-[#555b66]'>
                {item.author ?? 'Autor por definir'}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

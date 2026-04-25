const missionImagePath = '/landing/hero-orchestra.jpg'

type MVBlockProps = {
  title: string
  description: string
  imageLeft?: boolean
}

function MVBlock({ title, description, imageLeft = false }: MVBlockProps) {
  return (
    <article
      className={[
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
        imageLeft ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
      ].join(' ')}
    >
      <div className='h-[270px] w-full overflow-hidden rounded-[16px] bg-white shadow-[0px_6px_16px_rgba(0,0,0,0.16)] md:h-[320px] lg:h-[360px]'>
        <img alt={title} className='h-full w-full object-cover' src={missionImagePath} />
      </div>

      <div className='mx-auto max-w-[460px] text-center '>
        <h2 className='text-[40px] lg:text-[56px] my-6 font-bold leading-[1.05] text-ink'>{title}</h2>
        <p className='mt-5 text-[28px] leading-[1.3] text-[#4a4b4f]'>{description}</p>
      </div>
    </article>
  )
}

export default function MVSection() {
  const description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget justo congue, placerat urna et, facilisis odio. Mauris dapibus odio otenti. Nunc blandit iaculis velit, id aliquam nisl cursus ac.'

  return (
    <section className='bg-white pb-18 pt-8' id='mision-vision'>
      <div className='mx-auto w-full max-w-[1400px] space-y-16 px-4 lg:px-5'>
        <MVBlock
          description={description}
          imageLeft
          title='Misión'
        />

        <MVBlock
          description={description}
          title='Visión'
        />
      </div>
    </section>
  )
}

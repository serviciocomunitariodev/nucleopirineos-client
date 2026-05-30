
type MVBlockProps = {
  title: string
  description: string
  imageLeft?: boolean
  imageUrl?: string
}

function MVBlock({ title, description, imageLeft = false, imageUrl }: MVBlockProps) {

  return (
    <article
      className={[
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-14',
        imageLeft ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
      ].join(' ')}
    >
      <div className='h-[270px] w-full overflow-hidden rounded-[16px] bg-white shadow-[0px_6px_16px_rgba(0,0,0,0.16)] md:h-[320px] lg:h-[360px]'>
        <img alt={title} className='h-full w-full object-cover' src={imageUrl} />
      </div>

      <div className='mx-auto max-w-[640px] text-center '>
        <h2 className='text-[40px] lg:text-[56px] my-6 font-bold leading-[1.05] text-ink'>{title}</h2>
        <p className='mt-5 whitespace-pre-line text-[20px] lg:text-[28px] leading-[1.3] text-[#4a4b4f]'>{description}</p>
      </div>
    </article>
  )
}

type MVSectionProps = {
  missionImageUrl?: string
  visionImageUrl?: string
  missionText: string
  visionText: string
}

export default function MVSection({ missionImageUrl, visionImageUrl, missionText, visionText }: MVSectionProps) {
  return (
    <section className='bg-white pb-18 pt-8' id='mision-vision'>
      <div className='mx-auto w-full max-w-[1400px] space-y-16 px-4 lg:px-5'>
        <MVBlock
          description={missionText}
          imageLeft
          imageUrl={missionImageUrl}
          title='Misión'
        />

        <MVBlock
          description={visionText}
          imageUrl={visionImageUrl}
          title='Visión'
        />
      </div>
    </section>
  )
}


type MVBlockProps = {
  title: string
  description: React.ReactNode
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
        <p className='mt-5 text-[20px] lg:text-[28px] leading-[1.3] text-[#4a4b4f]'>{description}</p>
      </div>
    </article>
  )
}

type MVSectionProps = {
  missionImageUrl?: string
  visionImageUrl?: string
}

export default function MVSection({ missionImageUrl, visionImageUrl }: MVSectionProps) {
  const mision = 'El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela constituye una obra social del Estado Venezolano consagrada al rescate pedagógico, ocupacional y ético de la infancia y la juventud, mediante la instrucción y la práctica colectiva de la música, dedicada a la capacitación, prevención y recuperación de los grupos más vulnerables del país, tanto por sus características etárias como por su situación socioeconómica.'

  const vision = (
    <>
      El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela es una institución abierta a toda la sociedad, con un alto concepto de excelencia musical, que contribuye al desarrollo integral del ser humano. Se vincula con la comunidad a través del intercambio, la cooperación y el cultivo de valores transcendentales que inciden en la transformación del niño, el joven y el entorno familiar. Se cuenta con un recurso humano dirigido al logro de una meta común, con mística y gozo, formando equipos multidisciplinarios altamente motivados e identificados con la Institución.
      <br />
      <br />
      Se reconoce al movimiento orquestal como una oportunidad para el desarrollo personal en lo intelectual, en lo espiritual, en lo social y en lo profesional, rescatando al niño y al joven de una juventud vacía, desorientada y desviada.
    </>
  )
  
  return (
    <section className='bg-white pb-18 pt-8' id='mision-vision'>
      <div className='mx-auto w-full max-w-[1400px] space-y-16 px-4 lg:px-5'>
        <MVBlock
          description={mision}
          imageLeft
          imageUrl={missionImageUrl}
          title='Misión'
        />

        <MVBlock
          description={vision}
          imageUrl={visionImageUrl}
          title='Visión'
        />
      </div>
    </section>
  )
}

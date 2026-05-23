import Facebook from '@mui/icons-material/Facebook'
import Instagram from '@mui/icons-material/Instagram'
import Mail from '@mui/icons-material/Mail'
import type { SvgIconComponent } from '@mui/icons-material'

const socialItems = [
  {
    key: 'mail',
    label: 'Correo del núcleo',
    href: 'mailto:núcleo.incespirienos@elsistema.org.ve',
    Icon: Mail,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/nucleopirineos?igsh=bHE2Z3ppd3BiZnJh',
    Icon: Instagram,
  },
] satisfies Array<{
  key: string
  label: string
  href: string
  Icon: SvgIconComponent
}>

export default function SocialMedia() {
  return (
    <section className='bg-white py-14 landing-section' id='contacto'>
      <div className='mx-auto w-full max-w-[1400px] px-4 text-center lg:px-5'>
        <h2 className='text-[28px] lg:text-[56px] font-bold leading-tight text-ink'>Redes sociales y contacto</h2>

        <div className='mt-10 grid gap-8 md:grid-cols-2 md:gap-10'>
          {socialItems.map(({ key, label, href, Icon }) => (
            <a
              key={key}
              className='group flex flex-col items-center justify-center gap-3'
              href={href}
              rel='noreferrer'
              target={href.startsWith('mailto:') ? undefined : '_blank'}
            >
              <div className='flex h-[118px] w-[118px] items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:-translate-y-0.5'>
                <Icon sx={{ fontSize: 110 }} />
              </div>
              <span className='text-[24px] lg:text-[36px] font-semibold text-[#3d424b]'>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

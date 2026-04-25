import { Typography } from '@mui/material'
import LandingLayout from '@/views/landing/layout/LandingLayout'

export default function CalendarPage() {
  return (
    <LandingLayout>
      <main className='bg-[#e7e7df]'>
        <section className='mx-auto w-full max-w-[1250px] px-4 py-16 lg:px-5'>
          <div className='rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0px_10px_22px_rgba(0,0,0,0.12)]'>
            <Typography variant='h4'>Calendario Publico</Typography>
            <Typography className='mt-3' color='text.secondary' variant='body1'>
              El calendario se unifico en la ruta /events para acceso publico y autenticado.
              Esta vista queda como referencia temporal del modelo funcional.
            </Typography>
            <ul className='mt-5 list-disc space-y-2 pl-5 text-[17px] text-slate-700'>
              <li>No registrados: acceden a /events en modo solo lectura y ven todos los eventos.</li>
              <li>Estudiantes autenticados: en /events veran eventos por nivel y/o instrumento.</li>
              <li>Profesores autenticados: en /events veran todo y podran crear, editar y eliminar.</li>
            </ul>
          </div>
        </section>
      </main>
    </LandingLayout>
  )
}

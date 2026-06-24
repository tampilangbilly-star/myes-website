import prisma from '@/lib/prisma';
import SlideForm from '@/components/SlideForm';
export default async function EditSlide({ params }) {
  const slide = await prisma.slide.findUnique({ where: { id: parseInt(params.id) } });
  if (!slide) return <p>Slide not found</p>;
  return <><h2 style={{color:'#fff',marginBottom:'1rem'}}>Edit Slide</h2><SlideForm initialData={JSON.parse(JSON.stringify(slide))} /></>;
}

import ModelUploadForm from '../components/ModelUploadForm'
import ProductUploadForm from '../components/ProductUploadForm'
import VideoUploadForm from '../components/VideoUploadForm'
import Gallery from '../components/Gallery'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upload Media</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ProductUploadForm />
          <ModelUploadForm />
          <VideoUploadForm />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Media Gallery</h2>
        <Gallery />
      </section>
    </div>
  )
}
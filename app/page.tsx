import Steganographr from '@/components/Steganographr'
import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto p-4 pt-20">
          <h1 className="text-4xl font-bold text-center mb-4">Steganographr</h1>
          <p className="text-gray-400 text-center mb-12">
            Hide messages within other messages using invisible zero-width characters
          </p>
          <Steganographr />
        </div>
      </div>
    </Layout>
  )
}


import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Gas-Lighting LLC. Based on Zach Aysan's concept</p>
      </div>
    </footer>
  )
}

export default Footer


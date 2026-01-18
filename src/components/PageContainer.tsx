import Header from './Header'
import TicketInputPanel from './TicketInputPanel'
import OutputPanel from './OutputPanel'

function PageContainer() {
  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TicketInputPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  )
}

export default PageContainer

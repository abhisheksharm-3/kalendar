import PricingTable from '../utils/pricing';

export const Pricing = () => {
  return (
    <div className="bg-black text-white bg-gradient-to-b from-black via-[#5D2CA8] to-[#200D42] py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter mb-6">Choose Your Plan</h2>
        <div className='max-w-2xl mx-auto'>
          <p className="text-center text-xl text-purple-200 mb-12">
            Unlock the full potential of AI-powered scheduling with our flexible pricing options. Choose the plan that best fits your needs and start optimizing your time today.
          </p>
        </div>
        <PricingTable />
      </div>
    </div>
  )
}
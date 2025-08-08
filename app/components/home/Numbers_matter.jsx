"use client"
import React from 'react'
import { FaUsers, FaTags, FaGift, FaCoins } from 'react-icons/fa'
import CountUp from 'react-countup'

const stats = [
  {
    icon: <FaCoins className="text-yellow-400 text-5xl" />,
    value: 128476,
    label: 'مستخدمين موفرين'
  },
  {
    icon: <FaTags className="text-purple-500 text-5xl" />,
    value: 55749,
    label: 'كوبونات فعالة'
  },
  {
    icon: <FaUsers className="text-pink-500 text-5xl" />,
    value: 4500,
    label: 'أعضاء مسجلين'
  },
  {
    icon: <FaGift className="text-blue-500 text-5xl" />,
    value: 895,
    label: 'هدايا'
  },
]

export default function Numbers_matter() {
  const [inView, setInView] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="pb-16 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#14b8a6] mb-2">أرقام تهمك</h2>
      <div className="w-40 h-1 bg-gradient-to-r from-[#14b8a6]    mx-auto mb-10 rounded-full"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group transition-all duration-500 ease-in-out transform hover:-translate-y-2 border-2 border-dashed border-gray-200 hover:border-[#14b8a6] rounded-2xl bg-white shadow-lg hover:shadow-[0_8px_30px_rgba(20,184,166,0.2)] p-6 cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-[#f0fdfa] rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>

            <div className="text-4xl font-bold text-[#14b8a6] mb-2">
              {inView ? <CountUp end={stat.value} duration={2} separator="," /> : 0}+
            </div>

            <div className="text-lg font-semibold text-gray-600 group-hover:text-[#14b8a6] transition-colors duration-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

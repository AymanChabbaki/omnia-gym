import React from 'react';
import { useLanguage } from '../store/LanguageContext';

const Privacy = () => {
  const { isRTL } = useLanguage();

  const sections = [
    {
      title: isRTL ? 'جمع المعلومات' : 'Data Collection',
      content: isRTL 
        ? 'نقوم بجمع المعلومات التي تقدمها لنا عند إتمام الطلب، مثل الاسم والعنوان ورقم الهاتف.' 
        : 'We collect information you provide to us when completing an order, such as your name, address, and phone number.'
    },
    {
      title: isRTL ? 'استخدام المعلومات' : 'Use of Information',
      content: isRTL 
        ? 'تستخدم هذه المعلومات فقط لمعالجة طلباتكم والتواصل معكم بخصوص التوصيل.' 
        : 'This information is used only to process your orders and communicate with you regarding delivery.'
    },
    {
      title: isRTL ? 'حماية البيانات' : 'Data Protection',
      content: isRTL 
        ? 'نحن نلتزم بأعلى معايير الأمان لحماية معلوماتكم الشخصية ولا نقوم بمشاركتها مع أطراف خارجية.' 
        : 'We adhere to the highest security standards to protect your personal information and do not share it with third parties.'
    },
    {
      title: isRTL ? 'ملفات تعريف الارتباط' : 'Cookies',
      content: isRTL 
        ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم على موقعنا.' 
        : 'We use cookies to improve the user experience on our website.'
    }
  ];

  return (
    <div className="bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 italic">
          {isRTL ? 'سياسة' : 'Privacy'} <span className="text-primary">{isRTL ? 'الخصوصية' : 'Policy'}</span>
        </h1>
        
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                {section.title}
              </h2>
              <p className="text-on-surface-variant text-base font-medium leading-relaxed opacity-70">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-gray-50 rounded-[40px] border border-gray-100 italic text-sm text-on-surface-variant text-center">
          {isRTL 
            ? 'آخر تحديث: 27 أبريل 2024. لأي استفسارات إضافية، يرجى الاتصال بنا.' 
            : 'Last updated: April 27, 2024. For any further inquiries, please contact us.'}
        </div>
      </div>
    </div>
  );
};

export default Privacy;

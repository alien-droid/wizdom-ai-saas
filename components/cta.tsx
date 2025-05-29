import Image from "next/image";
import React from "react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Start Learning, How you want it</div>
      <h2 className="text-3xl font-bold">Personalise your learning journey</h2>
      <p>
        Choose a subject, voice, style, and duration to create your own
        personalised learning experience that feel natural and engaging 🎉
      </p>
      <Image src="images/cta.svg" alt="cta-image" width={360} height={240} />
      <button className="btn-primary gap-4 w-full justify-center">
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <Link href="/partners/new">Build your teaching partner 📚</Link>
      </button>
    </section>
  );
};

export default CTA;

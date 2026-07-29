import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/Sections";

export const metadata = { title: "Contact Us" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="We are here to help" title="Contact Bridgecare" text="Send a general, product, media or partnership enquiry to our team." />
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-details-card">
            <span className="eyebrow">Customer support</span>
            <h2>Talk to our team</h2>
            <p>Our team can help with products, orders, delivery, distribution and general company enquiries.</p>
            <div className="contact-list">
              <a href="tel:+2348077733373"><Phone size={20}/><span><strong>Phone</strong><small>+234 807 773 3373</small></span></a>
              <a href="mailto:info@bridgecarepharmang.com"><Mail size={20}/><span><strong>Email</strong><small>info@bridgecarepharmang.com</small></span></a>
              <a href="https://wa.link/bridgecarepharmaltd" target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/><span><strong>WhatsApp</strong><small>Chat with Bridgecare</small></span></a>
              <div><MapPin size={20}/><span><strong>Office</strong><small>LASCOFED Building, 13 Isaacstan Close, off Wemco Road, Ogba, Lagos</small></span></div>
            </div>
          </div>
          <form className="form">
            <div className="form-row"><label>Name<input required name="name"/></label><label>Email<input required type="email" name="email"/></label></div>
            <label>Phone<input required type="tel" name="phone"/></label>
            <label>Enquiry type<select name="type"><option>General enquiry</option><option>Product enquiry</option><option>Order or delivery</option><option>Quality concern</option><option>Distributor enquiry</option><option>Media enquiry</option></select></label>
            <label>Message<textarea required name="message" rows={6}/></label>
            <button className="button" type="submit">Send enquiry</button>
          </form>
        </div>
      </section>
      <section className="contact-map-section" aria-label="Bridgecare office map">
        <iframe
          title="Bridgecare Pharmaceuticals office location in Ogba, Lagos"
          src="https://maps.google.com/maps?ll=6.6296,3.348294&z=17&t=m&hl=en-US&gl=US&mapclient=embed&q=LASCOFED%20Building%2013%20Isaacstan%20Close%20Off%20Wemco%20Road%20Ogba%20Lagos&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}

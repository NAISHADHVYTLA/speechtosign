import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Mic, BookOpen, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(230,60%,15%)] via-[hsl(220,50%,25%)] to-[hsl(195,60%,65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(220,20%,4%)_100%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Welcome to Sign Kit!
          </h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            The complete toolkit for Indian Sign Language. Explore our range of features which have been carefully designed keeping in mind the specific needs of people related to ISL.
          </p>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-display font-semibold rounded-full text-base hover:opacity-90 transition-opacity"
          >
            Get Started
            <ChevronDown className="w-5 h-5" />
          </a>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              We've got what you need!
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              A comprehensive and aesthetic Indian Sign Language toolkit. A minimalist yet informative interface with a wide range of features for working with ISL.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dive into our diverse services and let us know about your experience!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Convert Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center group hover:border-primary/40 transition-colors"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Convert</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Convert audio or text into Indian Sign Language. Speak into your mic or type the text and watch the 3D avatar perform ISL signs in real-time!
              </p>
              <Link
                to="/convert"
                className="mt-auto px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                EXPLORE NOW!
              </Link>
            </motion.div>

            {/* Learn Sign Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 flex flex-col items-center text-center group hover:border-primary/40 transition-colors"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Learn Sign</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Curious about Indian Sign Language? Select a sign from the list, watch the 3D avatar demonstrate it, and learn ISL at your own pace!
              </p>
              <Link
                to="/learn-sign"
                className="mt-auto px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                EXPLORE NOW!
              </Link>
            </motion.div>

            {/* Videos Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 flex flex-col items-center text-center group hover:border-primary/40 transition-colors"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Video className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Videos</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Create wonderful videos using Indian Sign Language. Upload your transcript or type your text and the system will automatically create a video using ISL!
              </p>
              <button
                className="mt-auto px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold text-sm rounded-lg cursor-default opacity-60"
              >
                COMING SOON
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sign Kit — Indian Sign Language Toolkit
          </p>
        </div>
      </footer>
    </div>
  );
}

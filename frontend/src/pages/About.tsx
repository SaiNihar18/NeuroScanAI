import { motion } from 'framer-motion';
import { Brain, Target, Zap, Shield, Database, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Model',
      description: 'Built using Xception CNN architecture, trained on thousands of brain MRI images',
    },
    {
      icon: Target,
      title: 'High Accuracy',
      description: 'Achieves high precision in classifying four types of brain tumors',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get instant results in seconds with our optimized inference pipeline',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical images are processed securely and never stored permanently',
    },
    {
      icon: Database,
      title: 'Trained on Quality Data',
      description: 'Model trained on a diverse, high-quality dataset of brain MRI scans',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'Regular updates and improvements based on latest research',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Upload Image',
      description: 'Upload a brain MRI scan in common image formats (PNG, JPG, etc.)',
    },
    {
      step: '2',
      title: 'AI Analysis',
      description: 'Our Xception CNN model processes the image and identifies patterns',
    },
    {
      step: '3',
      title: 'Get Results',
      description: 'Receive classification results with confidence scores instantly',
    },
    {
      step: '4',
      title: 'Consult Professional',
      description: 'Use results as preliminary information for medical consultation',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NeuroAI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering healthcare with artificial intelligence for early brain tumor detection
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to leverage cutting-edge deep learning technology to assist healthcare 
              professionals in early detection and classification of brain tumors. By providing fast, 
              accurate, and accessible AI-powered analysis, we aim to support better patient outcomes 
              and contribute to the advancement of medical imaging technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple, fast, and accurate analysis in four easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-20 -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground">
              Advanced technology meets user-friendly design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-lg"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Information */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border"
          >
            <h2 className="text-3xl font-bold mb-6">About the Model</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our brain tumor classification system is powered by the <strong>Xception CNN</strong> (Extreme Inception) 
                architecture, a state-of-the-art deep learning model specifically adapted for medical imaging.
              </p>
              <p>
                The model has been trained to classify brain MRI scans into <strong>four categories</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Glioma Tumor</li>
                <li>Meningioma Tumor</li>
                <li>Pituitary Tumor</li>
                <li>No Tumor</li>
              </ul>
              <p>
                Through extensive training on a diverse dataset of brain MRI images, our model achieves high accuracy 
                while maintaining fast inference times, making it suitable for real-world clinical support applications.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-muted border border-border">
                <p className="text-sm">
                  <strong>Disclaimer:</strong> This tool is designed for educational and research purposes. 
                  It should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

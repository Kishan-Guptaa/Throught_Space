import { Request, Response } from "express";
import { Page } from "../models/Page";

// Get Page Content by Slug
export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let page = await Page.findOne({ slug });

    if (!page) {
      // Return default content if not in DB yet (Seeding logic)
      const defaults: any = {
        'about': { 
          title: 'A Sanctuary for Thought', 
          content: `
            <p className="lead">ThoughtSpace is more than just a blogging platform—it is a digital sanctuary designed for those who believe that words matter.</p>
            <h3>Our Mission</h3>
            <p>We built ThoughtSpace to solve a common problem: the noise of the modern internet. Our mission is to provide a clean, premium environment where writers can organize their knowledge into intuitive folders and share their insights with a community that values depth over clicks.</p>
            <h3>The ThoughtSpace Way</h3>
            <ul>
              <li><strong>Folder-Based Clarity:</strong> Organize your series, research, or personal journals with ease.</li>
              <li><strong>Premium Aesthetics:</strong> A design system built for focus, featuring glassmorphism and modern typography.</li>
              <li><strong>Community Interaction:</strong> Meaningful engagement through follows, bookmarks, and a thoughtful like system.</li>
            </ul>
            <p>Whether you are a system architect documenting your next big build or a storyteller sharing your journey, you have a home here.</p>
          ` 
        },
        'guidelines': { 
          title: 'Community Standards', 
          content: `
            <p>To maintain the premium quality of our sanctuary, we ask all members of the ThoughtSpace community to adhere to these core principles:</p>
            <h3>1. Depth & Quality</h3>
            <p>We encourage well-researched, thoughtful content. While we welcome all topics, we prioritize writing that provides value, insight, or inspiration to the reader.</p>
            <h3>2. Respectful Discourse</h3>
            <p>Diversity of thought is our strength. Engage with other writers with empathy and intellectual honesty. Harassment, hate speech, and toxicity have no home here.</p>
            <h3>3. Authenticity</h3>
            <p>Be yourself. Plagiarism and AI-generated spam without human oversight are discouraged. We value the human spirit behind every word.</p>
            <h3>4. Privacy & Safety</h3>
            <p>Respect the privacy of others and maintain the security of our community. Do not share personal data without consent.</p>
          ` 
        },
        'privacy': { 
          title: 'Privacy & Data Commitment', 
          content: `
            <p>Your privacy is not a feature; it is a fundamental right. At ThoughtSpace, we are committed to being transparent about how we handle your data.</p>
            <h3>What We Collect</h3>
            <p>We only collect the data necessary to provide you with a personalized experience: your account credentials, your public profile information, and the content you choose to publish.</p>
            <h3>How We Use It</h3>
            <p>Your data is used to manage your folders, deliver your notifications, and display your work to your followers. We do not sell your personal information to third-party advertisers.</p>
            <h3>Security</h3>
            <p>We use industry-standard encryption and secure MongoDB infrastructure to ensure your thoughts stay protected.</p>
            <p>For more detailed inquiries, please contact our privacy team at <a href="mailto:privacy@thoughtspace.dev">privacy@thoughtspace.dev</a>.</p>
          ` 
        },
        'terms': { 
          title: 'Terms of Service', 
          content: `
            <p>Welcome to ThoughtSpace. By using our platform, you agree to the following terms:</p>
            <h3>User Responsibility</h3>
            <p>You retain full ownership of the content you publish on ThoughtSpace. However, by publishing, you grant us a license to display and distribute your work within our ecosystem.</p>
            <h3>Acceptable Use</h3>
            <p>You agree not to use ThoughtSpace for any illegal activities, including copyright infringement, distribution of malware, or systematic spamming.</p>
            <h3>Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend accounts that violate our community standards.</p>
            <h3>Modifications</h3>
            <p>We may update these terms as our platform evolves. Continued use of the platform constitutes acceptance of the new terms.</p>
          ` 
        }
      };


      if (defaults[slug]) {
        page = await Page.create({ slug, ...defaults[slug] });
      } else {
        return res.status(404).json({ error: "Page not found" });
      }
    }

    res.json({ page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Page Content (Admin only - though we don't have admin role yet, we'll just protect it)
export const updatePageContent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    const page = await Page.findOneAndUpdate(
      { slug },
      { title, content, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ message: "Page updated", page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

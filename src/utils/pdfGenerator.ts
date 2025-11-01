import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface VisionData {
  id: number;
  title: string;
  description: string;
  image?: string;
  progress: number;
  color: string;
  goals?: any[];
  tasks?: any[];
  todos?: any[];
  word?: string;
}

interface PDFOptions {
  title: string;
  subtitle?: string;
  visions: VisionData[];
  includeImages?: boolean;
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange';
}

export class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private colors: any;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.currentY = this.margin;
    
    this.colors = {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      dark: '#1F2937',
      light: '#F3F4F6',
      white: '#FFFFFF'
    };
  }

  private addNewPageIfNeeded(requiredHeight: number = 20): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private drawHeader(title: string, subtitle?: string): void {
    // Background gradient effect (simulated with rectangles)
    this.pdf.setFillColor(59, 130, 246); // Blue
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.pdf.setFillColor(139, 92, 246); // Purple
    this.pdf.rect(0, 0, this.pageWidth, 20, 'F');

    // Title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, 25);

    if (subtitle) {
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, this.margin, 35);
    }

    // Date
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.pdf.setFontSize(10);
    this.pdf.text(`Generated on: ${currentDate}`, this.pageWidth - this.margin - 60, 35);

    this.currentY = 50;
  }

  private drawSectionHeader(title: string, icon: string = '●'): void {
    this.addNewPageIfNeeded(15);
    
    // Section background
    this.pdf.setFillColor(243, 244, 246); // Light gray
    this.pdf.rect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, 12, 'F');
    
    this.pdf.setTextColor(31, 41, 55); // Dark gray
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${icon} ${title}`, this.margin, this.currentY + 5);
    
    this.currentY += 20;
  }

  private async drawImageFromUrl(imageUrl: string, x: number, y: number, width: number, height: number): Promise<void> {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width * 4; // Higher resolution
          canvas.height = height * 4;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            this.pdf.addImage(dataUrl, 'JPEG', x, y, width, height);
          }
          resolve();
        };
        
        img.onerror = () => {
          // Draw placeholder if image fails to load
          this.pdf.setFillColor(229, 231, 235);
          this.pdf.rect(x, y, width, height, 'F');
          this.pdf.setTextColor(107, 114, 128);
          this.pdf.setFontSize(8);
          this.pdf.text('Image not available', x + width/2 - 15, y + height/2);
          resolve();
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      // Draw placeholder
      this.pdf.setFillColor(229, 231, 235);
      this.pdf.rect(x, y, width, height, 'F');
    }
  }

  private drawProgressBar(x: number, y: number, width: number, progress: number, color: string = this.colors.primary): void {
    // Background
    this.pdf.setFillColor(229, 231, 235);
    this.pdf.rect(x, y, width, 4, 'F');
    
    // Progress
    const progressWidth = (width * progress) / 100;
    this.pdf.setFillColor(59, 130, 246); // Blue
    this.pdf.rect(x, y, progressWidth, 4, 'F');
    
    // Progress text
    this.pdf.setTextColor(31, 41, 55);
    this.pdf.setFontSize(8);
    this.pdf.text(`${progress}%`, x + width + 5, y + 3);
  }

  private drawCheckbox(x: number, y: number, checked: boolean): void {
    // Checkbox background
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(x, y, 4, 4, 'FD');
    
    if (checked) {
      // Checkmark
      this.pdf.setDrawColor(16, 185, 129); // Green
      this.pdf.setLineWidth(0.5);
      this.pdf.line(x + 1, y + 2, x + 2, y + 3);
      this.pdf.line(x + 2, y + 3, x + 3.5, y + 1);
    }
  }

  private drawVisionCard(vision: VisionData): void {
    this.addNewPageIfNeeded(80);
    
    const cardY = this.currentY;
    const cardHeight = 75;
    
    // Card background
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(this.margin, cardY, this.pageWidth - 2 * this.margin, cardHeight, 'F');
    
    // Card border
    this.pdf.setDrawColor(229, 231, 235);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margin, cardY, this.pageWidth - 2 * this.margin, cardHeight, 'D');
    
    // Vision image
    if (vision.image) {
      this.drawImageFromUrl(vision.image, this.margin + 5, cardY + 5, 30, 20);
    }
    
    // Vision title
    this.pdf.setTextColor(31, 41, 55);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(vision.title, this.margin + 40, cardY + 12);
    
    // Vision description
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(107, 114, 128);
    const descLines = this.pdf.splitTextToSize(vision.description, 120);
    this.pdf.text(descLines.slice(0, 2), this.margin + 40, cardY + 18);
    
    // Progress bar
    this.drawProgressBar(this.margin + 40, cardY + 30, 80, vision.progress);
    
    this.currentY = cardY + cardHeight + 10;
  }

  private drawGoalsList(goals: any[]): void {
    if (!goals || goals.length === 0) return;
    
    this.drawSectionHeader('Goals', '🎯');
    
    goals.forEach((goal, index) => {
      this.addNewPageIfNeeded(15);
      
      // Goal item background
      this.pdf.setFillColor(239, 246, 255); // Light blue
      this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 'F');
      
      // Checkbox
      this.drawCheckbox(this.margin + 5, this.currentY + 4, goal.completed || false);
      
      // Goal text
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', goal.completed ? 'normal' : 'bold');
      
      const goalText = goal.text || goal.name || goal.title || `Goal ${index + 1}`;
      this.pdf.text(goalText, this.margin + 12, this.currentY + 7);
      
      // Priority badge
      if (goal.priority) {
        const priorityColor: [number, number, number] = goal.priority === 'High' ? [239, 68, 68] : 
                            goal.priority === 'Medium' ? [245, 158, 11] : [34, 197, 94];
        this.pdf.setFillColor(...priorityColor);
        this.pdf.rect(this.pageWidth - this.margin - 25, this.currentY + 2, 20, 8, 'F');
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(8);
        this.pdf.text(goal.priority, this.pageWidth - this.margin - 22, this.currentY + 7);
      }
      
      this.currentY += 15;
    });
  }

  private drawTasksList(tasks: any[]): void {
    if (!tasks || tasks.length === 0) return;
    
    this.drawSectionHeader('Tasks', '✅');
    
    tasks.forEach((task, index) => {
      this.addNewPageIfNeeded(15);
      
      // Task item background
      this.pdf.setFillColor(240, 253, 244); // Light green
      this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 'F');
      
      // Checkbox
      this.drawCheckbox(this.margin + 5, this.currentY + 4, task.completed || false);
      
      // Task text
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', task.completed ? 'normal' : 'bold');
      
      const taskText = task.text || task.name || task.title || `Task ${index + 1}`;
      this.pdf.text(taskText, this.margin + 12, this.currentY + 7);
      
      // Date and time
      if (task.date || task.time) {
        this.pdf.setTextColor(107, 114, 128);
        this.pdf.setFontSize(8);
        const dateTime = `${task.date || ''} ${task.time || ''}`.trim();
        this.pdf.text(dateTime, this.pageWidth - this.margin - 40, this.currentY + 7);
      }
      
      this.currentY += 15;
    });
  }

  private drawTodosList(todos: any[]): void {
    if (!todos || todos.length === 0) return;
    
    this.drawSectionHeader('To-Do\'s', '📝');
    
    todos.forEach((todo, index) => {
      this.addNewPageIfNeeded(15);
      
      // Todo item background
      this.pdf.setFillColor(254, 243, 199); // Light yellow
      this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, 'F');
      
      // Checkbox
      this.drawCheckbox(this.margin + 5, this.currentY + 4, todo.completed || false);
      
      // Todo text
      this.pdf.setTextColor(31, 41, 55);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', todo.completed ? 'normal' : 'bold');
      
      const todoText = todo.text || todo.name || todo.title || `Todo ${index + 1}`;
      this.pdf.text(todoText, this.margin + 12, this.currentY + 7);
      
      // Due date
      if (todo.dueDate) {
        this.pdf.setTextColor(107, 114, 128);
        this.pdf.setFontSize(8);
        this.pdf.text(`Due: ${todo.dueDate}`, this.pageWidth - this.margin - 40, this.currentY + 7);
      }
      
      this.currentY += 15;
    });
  }

  private drawMyWord(word: string): void {
    if (!word) return;
    
    this.drawSectionHeader('My Word (Integrity)', '❤️');
    
    this.addNewPageIfNeeded(20);
    
    // Word background
    this.pdf.setFillColor(254, 242, 242); // Light red
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 15, 'F');
    
    // Word text
    this.pdf.setTextColor(31, 41, 55);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'italic');
    
    const wordLines = this.pdf.splitTextToSize(`"${word}"`, this.pageWidth - 2 * this.margin - 10);
    this.pdf.text(wordLines, this.margin + 5, this.currentY + 8);
    
    this.currentY += 25;
  }

  public async generatePDF(options: PDFOptions): Promise<void> {
    // Draw header
    this.drawHeader(options.title, options.subtitle);
    
    // Summary section
    this.drawSectionHeader('Summary', '📊');
    
    const totalGoals = options.visions.reduce((acc, v) => acc + (v.goals?.length || 0), 0);
    const completedGoals = options.visions.reduce((acc, v) => 
      acc + (v.goals?.filter(g => g.completed).length || 0), 0);
    const totalTasks = options.visions.reduce((acc, v) => acc + (v.tasks?.length || 0), 0);
    const completedTasks = options.visions.reduce((acc, v) => 
      acc + (v.tasks?.filter(t => t.completed).length || 0), 0);
    
    this.pdf.setTextColor(31, 41, 55);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    this.pdf.text(`Total Visions: ${options.visions.length}`, this.margin, this.currentY);
    this.pdf.text(`Total Goals: ${totalGoals} (${completedGoals} completed)`, this.margin, this.currentY + 8);
    this.pdf.text(`Total Tasks: ${totalTasks} (${completedTasks} completed)`, this.margin, this.currentY + 16);
    
    this.currentY += 30;
    
    // Draw each vision with its details
    for (const vision of options.visions) {
      this.addNewPageIfNeeded(100);
      
      // Vision header
      this.drawSectionHeader(`Vision: ${vision.title}`, '👁️');
      
      // Vision card
      await this.drawVisionCard(vision);
      
      // Goals
      if (vision.goals && vision.goals.length > 0) {
        this.drawGoalsList(vision.goals);
      }
      
      // Tasks
      if (vision.tasks && vision.tasks.length > 0) {
        this.drawTasksList(vision.tasks);
      }
      
      // Todos
      if (vision.todos && vision.todos.length > 0) {
        this.drawTodosList(vision.todos);
      }
      
      // My Word
      if (vision.word) {
        this.drawMyWord(vision.word);
      }
      
      this.currentY += 10;
    }
    
    // Footer on last page
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(107, 114, 128);
    this.pdf.text('Generated by SwarYoga Life Planner', this.margin, this.pageHeight - 10);
    this.pdf.text(`Page ${this.pdf.getNumberOfPages()}`, this.pageWidth - this.margin - 15, this.pageHeight - 10);
  }

  public save(filename: string = 'life-planner.pdf'): void {
    this.pdf.save(filename);
  }

  public getBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Helper function to generate PDF from vision data
export const generateLifePlannerPDF = async (
  visions: any[],
  title: string = 'My Life Planner',
  subtitle?: string
): Promise<void> => {
  const pdfGenerator = new PDFGenerator();
  
  const options: PDFOptions = {
    title,
    subtitle,
    visions: visions.map(vision => ({
      id: vision.id,
      title: vision.title || vision.name,
      description: vision.description,
      image: vision.image || vision.imageUrl,
      progress: vision.progress || 0,
      color: vision.color || '#3B82F6',
      goals: vision.goals || [],
      tasks: vision.tasks || [],
      todos: vision.todos || [],
      word: vision.word
    })),
    includeImages: true
  };
  
  await pdfGenerator.generatePDF(options);
  
  const currentDate = new Date().toISOString().split('T')[0];
  pdfGenerator.save(`life-planner-${currentDate}.pdf`);
};
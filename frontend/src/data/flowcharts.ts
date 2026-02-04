// Flowchart Data for StoreBuddy Retail Companion
export interface FlowchartData {
  title: string;
  description: string;
  icon: string;
  color: string;
  code: string;
}

export const flowchartData: Record<string, FlowchartData> = {
  main: {
    title: "Main System Architecture",
    description: "Complete AI-powered financial assistance system flow",
    icon: "Layout",
    color: "from-slate-600 to-slate-800",
    code: `graph TB
    Start["👤 USER INPUT<br/>Voice | Text | Photo | Auto"]
    
    Start --> Phase0["📱 PHASE 0<br/>Offline-First<br/>100% Works Offline"]
    
    Phase0 --> Orchestrator["🧠 Orchestrator<br/>Claude 4.5"]
    
    Orchestrator --> Emergency{"🚨 Emergency?"}
    
    Emergency -->|YES| FastTrack["⚡ Fast-Track<br/>2-Second Response"]
    Emergency -->|NO| Phase1
    
    Phase1["📊 PHASE 1<br/>Data Collection<br/>Multi-source"]
    Phase1 --> Phase2["🔍 PHASE 2<br/>Analysis<br/>4 Parallel Agents"]
    Phase2 --> Phase3["🔄 PHASE 3<br/>Reasoning<br/>Smart Recommendations"]
    Phase3 --> Phase4["⚡ PHASE 4<br/>Action Layer<br/>Multi-channel Delivery"]
    Phase4 --> Phase5["🧠 PHASE 5<br/>Learning Loop<br/>Adaptation"]
    Phase5 --> Monitor["🌟 Proactive Monitoring<br/>24/7 Every 6 Hours"]
    Monitor --> Orchestrator
    
    FastTrack --> Phase4
    
    style Start fill:#f1f5f9,stroke:#334155,stroke-width:3px
    style Orchestrator fill:#475569,stroke:#334155,stroke-width:3px,color:#fff
    style Phase0 fill:#64748b,stroke:#475569,stroke-width:2px,color:#fff
    style Phase1 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Phase2 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Phase3 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Phase4 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Phase5 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Monitor fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
    style FastTrack fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff`
  },
  
  phase0: {
    title: "Offline-First Engine",
    description: "Device-first data collection with smart synchronization",
    icon: "Database",
    color: "from-slate-600 to-slate-700",
    code: `graph TB
    Input["📥 INPUT CHANNELS"]
    
    Input --> Voice["🎤 Voice Input<br/>Speech-to-Text<br/>Transcription"]
    Input --> Text["📝 Text Input<br/>Manual Entry<br/>Chat Interface"]
    Input --> Photo["📸 Photo Input<br/>Receipt OCR<br/>Document Scan"]
    Input --> Auto["🔄 Auto Input<br/>Bank APIs<br/>Gig App Sync"]
    
    Voice --> LocalStore["💾 LOCAL STORAGE LAYER<br/>SQLite Database"]
    Text --> LocalStore
    Photo --> LocalStore
    Auto --> LocalStore
    
    LocalStore --> Cache["⚡ Smart Cache<br/>Recent Data<br/>Frequent Queries<br/>User Preferences"]
    
    LocalStore --> Validation["✅ Data Validation<br/>Format Check<br/>Duplicate Detection<br/>Integrity Verify"]
    
    Validation --> Valid{"Data Valid?"}
    Valid -->|NO| ErrorHandle["⚠️ Error Handler<br/>User Notification<br/>Retry Logic"]
    Valid -->|YES| Process
    
    ErrorHandle --> Process["🔧 Data Processing<br/>Normalize Values<br/>Categorize Types<br/>Add Timestamps"]
    
    Cache --> Process
    
    Process --> Sync{"📡 Check Network"}
    
    Sync -->|ONLINE| CloudSync["☁️ Cloud Sync<br/>AWS/Azure Upload<br/>Conflict Resolution<br/>Bi-directional Sync"]
    Sync -->|OFFLINE| Queue["📅 Sync Queue<br/>Store Instructions<br/>Retry Later"]
    
    CloudSync --> Verification["✓ Verification<br/>Checksum Validate<br/>Encryption Verify"]
    Queue --> LocalFeatures
    
    Verification --> LocalFeatures["✨ Offline Features<br/>View History<br/>Search Data<br/>View Alerts<br/>See Budgets"]
    
    LocalFeatures --> Ready["✅ Data Ready<br/>For Processing"]
    
    Ready --> Next["🚀 To Phase 1<br/>Data Analysis"]
    
    style Input fill:#e0f2fe,stroke:#0369a1,stroke-width:3px
    style LocalStore fill:#0284c7,stroke:#0369a1,stroke-width:3px,color:#fff
    style Process fill:#059669,stroke:#047857,stroke-width:2px,color:#fff`
  },

  features: {
    title: "Core Features Overview",
    description: "Key capabilities and user benefits",
    icon: "Zap",
    color: "from-emerald-600 to-emerald-700",
    code: `graph LR
    User["🏪 Shop Owner"]
    
    User --> Sales["💰 Sales Tracking<br/>• Daily revenue<br/>• Multi-channel sync<br/>• Pattern recognition"]
    
    User --> Inventory["📊 Smart Inventory<br/>• Stock alerts<br/>• Reorder points<br/>• Seasonal demand"]
    
    User --> Programs["🏆 UAE SME Programs<br/>• MOHRE support<br/>• SME funding<br/>• Emiratisation"]
    
    User --> VAT["📄 VAT Management<br/>• 5% compliance<br/>• Deduction tracking<br/>• FTA reporting"]
    
    Sales --> Analysis["🔍 AI Analysis"]
    Inventory --> Analysis
    Programs --> Analysis
    VAT --> Analysis
    
    Analysis --> Insights["💡 Smart Insights<br/>• Business advice<br/>• Proactive alerts<br/>• Growth opportunities"]
    
    style User fill:#f3f4f6,stroke:#374151,stroke-width:3px
    style Sales fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
    style Inventory fill:#0891b2,stroke:#0e7490,stroke-width:2px,color:#fff
    style Programs fill:#7c3aed,stroke:#6b21a8,stroke-width:2px,color:#fff
    style VAT fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff
    style Analysis fill:#374151,stroke:#1f2937,stroke-width:3px,color:#fff
    style Insights fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff`
  }
};

export type FlowchartKey = keyof typeof flowchartData;
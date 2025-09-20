# 🧩 Component Library Documentation

## **Core UI Components**

### **Layout Components**

#### **DashboardHeader**

```typescript
// components/dashboard-header.tsx
interface DashboardHeaderProps {
  user?: User;
  onLogout?: () => void;
}

// Features:
// - Forest-themed logo with animations
// - Responsive navigation with active states
// - User avatar with dropdown menu
// - Mobile-friendly hamburger menu
// - Real-time notifications
```

#### **Sidebar**

```typescript
// components/sidebar.tsx
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
}

// Features:
// - Collapsible navigation
// - Icon-based menu items
// - Active state indicators
// - Role-based menu filtering
```

### **Form Components**

#### **ClaimForm**

```typescript
// components/forms/claim-form.tsx
interface ClaimFormProps {
  initialData?: Partial<Claim>;
  onSubmit: (data: ClaimFormData) => Promise<void>;
  isLoading?: boolean;
}

// Features:
// - Multi-step wizard interface
// - Real-time validation
// - File upload with progress
// - Auto-save functionality
// - Accessibility compliant
```

#### **DocumentUploader**

```typescript
// components/documents/document-uploader.tsx
interface DocumentUploaderProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

// Features:
// - Drag-and-drop interface
// - Multiple file selection
// - Real-time upload progress
// - File type validation
// - Preview thumbnails
// - Error handling with retry
```

### **Data Display Components**

#### **ClaimsTable**

```typescript
// components/claims/claims-table.tsx
interface ClaimsTableProps {
  claims: Claim[];
  onClaimSelect?: (claim: Claim) => void;
  onStatusChange?: (claimId: string, status: ClaimStatus) => void;
  loading?: boolean;
  pagination?: PaginationProps;
}

// Features:
// - Sortable columns
// - Advanced filtering
// - Bulk actions
// - Export functionality
// - Responsive design
// - Virtual scrolling for large datasets
```

#### **StatusBadge**

```typescript
// components/ui/status-badge.tsx
interface StatusBadgeProps {
  status: ClaimStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

// Statuses:
// - submitted (blue)
// - under_review (yellow)
// - approved (green)
// - rejected (red)
// - requires_info (orange)
```

## **Analytics Components**

### **Chart Components**

#### **ClaimsOverviewChart**

```typescript
// components/analytics/claims-overview-chart.tsx
interface ClaimsOverviewChartProps {
  data: ChartDataPoint[];
  timeframe?: "week" | "month" | "quarter" | "year";
  showLegend?: boolean;
}

// Features:
// - Interactive bar chart
// - Hover tooltips
// - Responsive design
// - Export to PNG/SVG
// - Real-time data updates
```

#### **StatusDistributionChart**

```typescript
// components/analytics/status-distribution-chart.tsx
interface StatusDistributionChartProps {
  data: StatusData[];
  showPercentages?: boolean;
  colorScheme?: "default" | "forest" | "ocean";
}

// Features:
// - Interactive pie chart
// - Custom color schemes
// - Animation on load
// - Click to filter
// - Accessibility labels
```

#### **RegionalAnalysisChart**

```typescript
// components/analytics/regional-analysis-chart.tsx
interface RegionalAnalysisChartProps {
  data: RegionalData[];
  mapView?: boolean;
  drilldownEnabled?: boolean;
}

// Features:
// - Horizontal bar chart
// - Geographic map integration
// - Drill-down capability
// - Performance indicators
// - Comparative analysis
```

## **Document Processing Components**

### **OCRResultsDisplay**

```typescript
// components/documents/ocr-results-display.tsx
interface OCRResultsDisplayProps {
  result: OCRResult;
  onEntityVerify?: (entityId: string, verified: boolean) => void;
  onTextEdit?: (newText: string) => void;
  className?: string;
}

// Features:
// - Tabbed interface (Text, Entities, Analytics)
// - Entity highlighting with colors
// - Confidence score visualization
// - Editable text with change tracking
// - Export functionality
```

### **IntegratedAnalysis**

```typescript
// components/documents/integrated-analysis.tsx
interface IntegratedAnalysisProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  maxFileSize?: number;
  supportedFormats?: string[];
}

// Features:
// - Complete OCR + DSS workflow
// - Real-time progress tracking
// - WebSocket status updates
// - Error handling with retry
// - Results visualization
```

## **Decision Support Components**

### **DecisionSupportDashboard**

```typescript
// components/decision/decision-support-dashboard.tsx
interface DecisionSupportDashboardProps {
  recommendation: DSSRecommendation;
  onDecisionMade?: (decision: string, reasoning: string) => void;
  className?: string;
}

// Features:
// - Comprehensive analysis display
// - Risk factor visualization
// - Precedent case comparison
// - Interactive decision factors
// - Transparent AI reasoning
```

### **RiskAssessmentPanel**

```typescript
// components/decision/risk-assessment-panel.tsx
interface RiskAssessmentPanelProps {
  riskFactors: RiskFactor[];
  overallScore: number;
  onMitigationView?: (riskId: string) => void;
}

// Features:
// - Color-coded risk levels
// - Mitigation strategies
// - Risk trend analysis
// - Interactive risk matrix
```

## **Component Usage Examples**

### **Basic Implementation**

```typescript
// pages/claims/index.tsx
import { ClaimsTable, StatusBadge } from "@/components/claims";
import { useClaimsQuery } from "@/hooks/use-claims";

export default function ClaimsPage() {
  const { data: claims, isLoading } = useClaimsQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Claims Management</h1>
      <ClaimsTable
        claims={claims}
        loading={isLoading}
        onClaimSelect={(claim) => router.push(`/claims/${claim.id}`)}
      />
    </div>
  );
}
```

### **Advanced Usage with State Management**

```typescript
// pages/documents/processing.tsx
import { IntegratedAnalysis } from "@/components/documents";
import { useDocumentStore } from "@/stores/document-store";

export default function DocumentProcessingPage() {
  const { addAnalysisResult } = useDocumentStore();

  const handleAnalysisComplete = (result: AnalysisResult) => {
    addAnalysisResult(result);
    toast.success("Document analysis completed successfully!");
  };

  return (
    <IntegratedAnalysis
      onAnalysisComplete={handleAnalysisComplete}
      maxFileSize={10 * 1024 * 1024} // 10MB
      supportedFormats={["pdf", "png", "jpg", "tiff"]}
    />
  );
}
```

## **Styling Guidelines**

### **Forest Theme Colors**

```css
:root {
  --forest-primary: #059669;
  --forest-secondary: #0d9488;
  --forest-accent: #06b6d4;
  --forest-light: #ecfdf5;
  --forest-dark: #064e3b;
}
```

### **Component Variants**

```typescript
// Standard component variants
const variants = {
  default: "bg-background text-foreground",
  forest: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
  ocean: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
  earth: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
};
```

### **Animation Classes**

```css
.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

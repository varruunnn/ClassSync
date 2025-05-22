import { Card, CardContent } from "@/components/ui/card";
import type { Subject } from "@/types";

interface SubjectCardsProps {
  subjects: Subject[];
}

export default function SubjectCards({ subjects }: SubjectCardsProps) {

  const getColorForType = (type: string): string => {
    const colorMap: Record<string, string> = {
      math: '#3b82f6',      // blue-500
      science: '#10b981',   // green-500
      english: '#f59e0b',   // amber-500
      history: '#ef4444',   // red-500
      art: '#eab308',       // yellow-500
      default: '#9ca3af'    // gray-400
    };
  
    return colorMap[type.toLowerCase()] || colorMap.default;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
      {subjects.map((subject) => (
        <Card 
        key={subject.id} 
        style={{ borderLeftColor: getColorForType(subject.type) }}
        className={`border-l-4 border-${subject.type} hover:shadow-md transition-all duration-300`}>
          <CardContent className="p-4">
            <h3 className="font-medium">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">{subject.teacher}</p>
          </CardContent>
        </Card>
      ))}
    </div>  
  );
}
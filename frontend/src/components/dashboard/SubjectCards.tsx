import { Card, CardContent } from "@/components/ui/card";
import type { Subject } from "@/types";

interface SubjectCardsProps {
  subjects: Subject[];
}

export default function SubjectCards({ subjects }: SubjectCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
      {subjects.map((subject) => (
        <Card key={subject.id} className={`border-l-4 border-${subject.type} hover:shadow-md transition-all duration-300`}>
          <CardContent className="p-4">
            <h3 className="font-medium">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">{subject.teacher}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
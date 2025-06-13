import { Card, CardContent } from "@/components/ui/card";

interface SubjectCardsProps {
  subjects: string[];
}

export default function SubjectCards({ subjects }: SubjectCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {subjects.map((name) => (
        <Card
          key={name}
          className="
            relative 
            overflow-hidden 
            group 
            hover:shadow-xl 
            hover:scale-[1.02] 
            transition-all 
            duration-300 
            ease-in-out 
            border 
            border-gray-900 
            dark:border-gray-700 
            rounded-lg
          "
        >
          {" "}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 flex items-center justify-center h-full relative z-10">
            <h3
              className="
              font-semibold 
              text-xl 
              text-gray-800 
              dark:text-gray-100 
              group-hover:text-blue-600 
              dark:group-hover:text-blue-400 
              transition-colors 
              duration-300
            "
            >
              {name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Test } from "@/types";
import { FileText } from "lucide-react";

interface RecentTestsProps {
  tests: Test[];
}

export default function RecentTests({ tests }: RecentTestsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
        <CardDescription>View your recent test results and papers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Paper</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.title}</TableCell>
                <TableCell className="capitalize">{test.subject}</TableCell>
                <TableCell>{formatDate(test.date)}</TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${
                    test.percentile >= 85 
                      ? 'text-green-600' 
                      : test.percentile >= 70 
                        ? 'text-amber-600' 
                        : 'text-red-600'
                  }`}>
                    {test.marks}/{test.maxMarks} ({test.percentile}%)
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{test.title}</DialogTitle>
                        <DialogDescription>
                          {formatDate(test.date)} • Score: {test.marks}/{test.maxMarks}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-hidden rounded-md border">
                        {/* This would display the actual PDF or test paper */}
                        <div className="flex items-center justify-center h-full bg-muted p-8">
                          <div className="text-center">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-medium">Test Paper Preview</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              In a real app, the actual test paper would be displayed here
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

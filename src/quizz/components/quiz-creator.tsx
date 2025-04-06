'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, ChevronLeft, ChevronRight, Clock, Copy, ImageIcon, Plus, Settings, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface Question {
    id: string;
    text: string;
    image: string | null;
    timeLimit: number;
    points: string;
    answerType: string;
    answers: Answer[];
}

interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
    color: string;
}

const COLORS = {
    red: 'bg-red-500 hover:bg-red-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    green: 'bg-green-500 hover:bg-green-600',
};

export default function QuizCreator() {
    const router = useRouter();
    const [title, setTitle] = useState('Untitled Quiz');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: '1',
            text: '',
            image: null,
            timeLimit: 30,
            points: 'standard',
            answerType: 'single',
            answers: [
                { id: 'a1', text: '', isCorrect: false, color: 'red' },
                { id: 'a2', text: '', isCorrect: false, color: 'blue' },
                { id: 'a3', text: '', isCorrect: false, color: 'yellow' },
                { id: 'a4', text: '', isCorrect: false, color: 'green' },
            ],
        },
    ]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentQuestion = questions[currentQuestionIndex];

    const handleQuestionChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].text = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (id: string, value: string) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[currentQuestionIndex];
        const answerIndex = question.answers.findIndex((a) => a.id === id);

        if (answerIndex !== -1) {
            question.answers[answerIndex].text = value;
            setQuestions(updatedQuestions);
        }
    };

    const handleCorrectAnswerChange = (id: string) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[currentQuestionIndex];

        // For single select, only one answer can be correct
        if (question.answerType === 'single') {
            question.answers.forEach((answer) => {
                answer.isCorrect = answer.id === id;
            });
        } else {
            // For multiple select, toggle the correct state
            const answerIndex = question.answers.findIndex((a) => a.id === id);
            if (answerIndex !== -1) {
                question.answers[answerIndex].isCorrect = !question.answers[answerIndex].isCorrect;
            }
        }

        setQuestions(updatedQuestions);
    };

    const handleTimeLimitChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].timeLimit = Number.parseInt(value);
        setQuestions(updatedQuestions);
    };

    const handlePointsChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].points = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerTypeChange = (value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].answerType = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q${questions.length + 1}`,
            text: '',
            image: null,
            timeLimit: 30,
            points: 'standard',
            answerType: 'single',
            answers: [
                { id: `q${questions.length + 1}a1`, text: '', isCorrect: false, color: 'red' },
                { id: `q${questions.length + 1}a2`, text: '', isCorrect: false, color: 'blue' },
                { id: `q${questions.length + 1}a3`, text: '', isCorrect: false, color: 'yellow' },
                { id: `q${questions.length + 1}a4`, text: '', isCorrect: false, color: 'green' },
            ],
        };

        setQuestions([...questions, newQuestion]);
        setCurrentQuestionIndex(questions.length);
    };

    const duplicateQuestion = () => {
        const questionToDuplicate = questions[currentQuestionIndex];
        const duplicatedQuestion: Question = {
            ...JSON.parse(JSON.stringify(questionToDuplicate)),
            id: `q${questions.length + 1}`,
        };

        // Update answer IDs to be unique
        duplicatedQuestion.answers = duplicatedQuestion.answers.map((answer, index) => ({
            ...answer,
            id: `q${questions.length + 1}a${index + 1}`,
        }));

        const newQuestions = [...questions];
        newQuestions.splice(currentQuestionIndex + 1, 0, duplicatedQuestion);
        setQuestions(newQuestions);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const deleteQuestion = () => {
        if (questions.length <= 1) return;

        const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
        setQuestions(newQuestions);

        // Adjust current index if needed
        if (currentQuestionIndex >= newQuestions.length) {
            setCurrentQuestionIndex(newQuestions.length - 1);
        }
    };

    const addMoreAnswers = () => {
        if (currentQuestion.answers.length >= 6) return;

        const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink'];
        const updatedQuestions = [...questions];
        const newAnswer = {
            id: `q${currentQuestionIndex + 1}a${currentQuestion.answers.length + 1}`,
            text: '',
            isCorrect: false,
            color: colors[currentQuestion.answers.length % colors.length],
        };

        updatedQuestions[currentQuestionIndex].answers.push(newAnswer);
        setQuestions(updatedQuestions);
    };

    const handleDeleteAnswer = (answerId: string) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[currentQuestionIndex];
        // Ensure we don't delete below the minimum required answers (e.g., 2)
        if (question.answers.length <= 2) return;

        question.answers = question.answers.filter((answer) => answer.id !== answerId);
        setQuestions(updatedQuestions);
    };

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex].image = reader.result as string;
                setQuestions(updatedQuestions);
                setIsImageModalOpen(false);
            };
            reader.readAsDataURL(file);
        }
        // Reset file input value to allow uploading the same file again
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSelectFromGallery = (imageUrl: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].image = imageUrl;
        setQuestions(updatedQuestions);
        setIsImageModalOpen(false);
    };

    const handleRemoveImage = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].image = null;
        setQuestions(updatedQuestions);
    };

    const saveQuiz = () => {
        // In a real app, you would save the quiz to a database
        console.log('Saving quiz:', { title, questions });
        router.push('/dashboard');
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    // Placeholder gallery images
    const galleryImages = [
        '/placeholder.svg?height=100&width=100&text=Gallery+1',
        '/placeholder.svg?height=100&width=100&text=Gallery+2',
        '/placeholder.svg?height=100&width=100&text=Gallery+3',
        '/placeholder.svg?height=100&width=100&text=Gallery+4',
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b bg-white">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-[#46178f]">QuizMaster!</div>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-none text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Enter kahoot title..."
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline">Preview</Button>
                        <Button variant="outline">Exit</Button>
                        <Button onClick={saveQuiz}>Save</Button>
                    </div>
                </div>
            </header>

            {/* Hidden File Input for Image Upload */}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

            <div className="flex">
                {/* Question sidebar */}
                <div className="h-[calc(100vh-120px)] w-64 overflow-y-auto border-r bg-white">
                    <div className="p-4">
                        <Button onClick={addQuestion} className="mb-4 w-full">
                            Add question
                        </Button>
                        <Button onClick={addQuestion} variant="outline" className="w-full">
                            Add slide
                        </Button>
                    </div>
                    <div className="border-t">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`cursor-pointer border-b p-4 ${index === currentQuestionIndex ? 'bg-gray-100' : ''}`}
                                onClick={() => goToQuestion(index)}
                            >
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-200">{index + 1}</div>
                                    <div className="flex-1 truncate">
                                        <div className="font-medium">{question.text || `Question ${index + 1}`}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Question editor */}
                <div className="flex-1 p-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-6 rounded-lg bg-[#e9d8f4] p-8">
                            <Input
                                value={currentQuestion.text}
                                onChange={(e) => handleQuestionChange(e.target.value)}
                                className="mb-6 h-auto border-none bg-white p-4 text-xl font-medium"
                                placeholder="Start typing your question"
                            />

                            {currentQuestion.image ? (
                                <div className="relative mb-6 h-64">
                                    <Image src={currentQuestion.image} alt="Question image" fill className="object-contain" />
                                    <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="mb-6 h-64 w-full border-2 border-dashed bg-white/50"
                                    onClick={() => setIsImageModalOpen(true)}
                                >
                                    <div className="flex flex-col items-center">
                                        <ImageIcon size={48} className="mb-2 text-gray-400" />
                                        <span>Add image</span>
                                    </div>
                                </Button>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.answers.map((answer) => (
                                    <div key={answer.id} className="group relative">
                                        <div className={`${COLORS[answer.color as keyof typeof COLORS]} rounded-md p-4 text-white`}>
                                            <div className="flex items-center">
                                                <div
                                                    className={`mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 border-white ${
                                                        answer.isCorrect ? 'bg-white' : ''
                                                    }`}
                                                    onClick={() => handleCorrectAnswerChange(answer.id)}
                                                >
                                                    {answer.isCorrect && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className={`h-4 w-4 ${
                                                                answer.color === 'red'
                                                                    ? 'text-red-500'
                                                                    : answer.color === 'blue'
                                                                      ? 'text-blue-500'
                                                                      : answer.color === 'yellow'
                                                                        ? 'text-yellow-500'
                                                                        : 'text-green-500'
                                                            }`}
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <Input
                                                    value={answer.text}
                                                    onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                                                    className="border-none bg-transparent text-white placeholder-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    placeholder={`Add answer ${currentQuestion.answers.findIndex((a) => a.id === answer.id) + 1}`}
                                                />
                                            </div>
                                        </div>
                                        {currentQuestion.answers.length > 2 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 rounded-full text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/30"
                                                onClick={() => handleDeleteAnswer(answer.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {currentQuestion.answers.length < 6 && (
                                <Button variant="outline" className="mt-4 w-full" onClick={addMoreAnswers}>
                                    <Plus size={16} className="mr-2" />
                                    Add more answers
                                </Button>
                            )}
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2" />
                                            Time limit
                                        </div>
                                    </label>
                                    <Select value={currentQuestion.timeLimit.toString()} onValueChange={handleTimeLimitChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select time limit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 seconds</SelectItem>
                                            <SelectItem value="10">10 seconds</SelectItem>
                                            <SelectItem value="20">20 seconds</SelectItem>
                                            <SelectItem value="30">30 seconds</SelectItem>
                                            <SelectItem value="60">60 seconds</SelectItem>
                                            <SelectItem value="90">90 seconds</SelectItem>
                                            <SelectItem value="120">120 seconds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        <div className="flex items-center">
                                            <Award size={16} className="mr-2" />
                                            Points
                                        </div>
                                    </label>
                                    <Select value={currentQuestion.points} onValueChange={handlePointsChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select points" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="double">Double points</SelectItem>
                                            <SelectItem value="noPoints">No points</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        <div className="flex items-center">
                                            <Settings size={16} className="mr-2" />
                                            Answer options
                                        </div>
                                    </label>
                                    <Select value={currentQuestion.answerType} onValueChange={handleAnswerTypeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select answer type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single select</SelectItem>
                                            <SelectItem value="multiple">Multiple select</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between border-t pt-6">
                                <div>
                                    <Button variant="destructive" onClick={deleteQuestion} disabled={questions.length <= 1}>
                                        Delete
                                    </Button>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={duplicateQuestion}>
                                        <Copy size={16} className="mr-2" />
                                        Duplicate
                                    </Button>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                            disabled={currentQuestionIndex === 0}
                                        >
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <span>
                                            {currentQuestionIndex + 1} / {questions.length}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToQuestion(currentQuestionIndex + 1)}
                                            disabled={currentQuestionIndex === questions.length - 1}
                                        >
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Selection Modal */}
            {isImageModalOpen && (
                <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Image</DialogTitle>
                            <DialogDescription>Choose an image for your question. Upload a file or select one from the gallery.</DialogDescription>
                        </DialogHeader>
                        <div className="my-4">
                            <Button onClick={handleImageUploadClick} variant="outline" className="w-full">
                                Upload File
                            </Button>
                        </div>
                        {/* Gallery Section */}
                        <div className="mt-4">
                            <h3 className="mb-2 text-sm font-medium text-gray-600">Or select from gallery</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {galleryImages.map((imgUrl, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded border hover:opacity-80"
                                        onClick={() => handleSelectFromGallery(imgUrl)}
                                    >
                                        <Image src={imgUrl} alt={`Gallery image ${index + 1}`} layout="fill" objectFit="cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsImageModalOpen(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

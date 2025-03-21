const mockSections = [
  {
    id: 'section-1',

    title: 'Low Level Programming',
    lectures: [
      {
        id: 'cs50-lecture-0',
        title: 'CS50 Lecture 0: Introduction',
        description:
          'This lecture covers the basics of computing and how the internet works',
        tags: ['basics', 'internet'],
      },
      {
        id: 'cs50-lecture-1',
        title: 'CS50 Lecture 1: C',
        description:
          'This lecture covers the basics of the C programming language',
        tags: ['c', 'programming'],
      },
      {
        id: 'cs50-lecture-2',
        title: 'CS50 Lecture 2: Arrays',
        description: 'This lecture covers the basics of arrays in C',
        tags: ['arrays', 'c'],
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Data Structures and Algorithms',
    lectures: [
      {
        id: 'cs50-lecture-3',
        title: 'CS50 Lecture 3: Algorithms',
        description: 'This lecture covers the basics of algorithms',
        tags: ['algorithms', 'dsa'],
      },
      {
        id: 'cs50-lecture-4',
        title: 'CS50 Lecture 4: Searching, Sorting',
        description: 'This lecture covers searching and sorting algorithms',
        tags: ['searching', 'sorting', 'algorithms'],
      },
      {
        id: 'cs50-lecture-5',
        title: 'CS50 Lecture 5: Memory, Pointers',
        description: 'This lecture covers memory and pointers in C',
        tags: ['memory', 'pointers', 'c'],
      },
    ],
  },
  {
    id: 'section-3',
    title: 'High Level Programming',
    lectures: [
      {
        id: 'cs50-lecture-6',
        title: 'CS50 Lecture 6: Python',
        description:
          'This lecture covers the basics of the Python programming language',
        tags: ['python', 'programming'],
      },
      {
        id: 'cs50-lecture-7',
        title: 'CS50 Lecture 7: Object Oriented Programming',
        description:
          'This lecture covers object oriented programming in Python',
        tags: ['oop', 'python'],
      },
      {
        id: 'cs50-lecture-8',
        title: 'CS50 Lecture 8: File I/O',
        description: 'This lecture covers file input and output in Python',
        tags: ['file i/o', 'python'],
      },
    ],
  },
  {
    id: 'section-4',
    title: 'Frontend Development',
    lectures: [
      {
        id: 'cs50-lecture-9',
        title: 'CS50 Lecture 9: HTML, CSS',
        description: 'This lecture covers the basics of HTML and CSS',
        tags: ['html', 'css', 'frontend'],
      },
      {
        id: 'cs50-lecture-10',
        title: 'CS50 Lecture 10: JavaScript',
        description: 'This lecture covers the basics of JavaScript',
        tags: ['javascript', 'frontend'],
      },
      {
        id: 'cs50-lecture-11',
        title: 'CS50 Lecture 11: React',
        description: 'This lecture covers the basics of React',
        tags: ['react', 'frontend'],
      },
    ],
  },
  {
    id: 'section-5',
    title: 'Backend Development',
    lectures: [
      {
        id: 'cs50-lecture-12',
        title: 'CS50 Lecture 12: Flask',
        description: 'This lecture covers the basics of Flask',
        tags: ['flask', 'backend'],
      },
    ],
  },
];

const lectures = [
  {
    "title": "Week 0: Scratch",
    "description": "Computer Science. Computational Thinking. Problem Solving: Inputs, Outputs. Representation: Unary, Binary, Decimal, ASCII, Unicode, RGB. Abstraction. Algorithms. Running Times. Pseudocode. Scratch: Functions, Arguments, Return Values; Variables; Boolean Expressions, Conditionals; Loops; Events; Threads.",
    "tags": "scratch, intro, programming",
    "videoLink": "https://youtu.be/3LPJfIKxwWc",
    "notes": "https://cs50.harvard.edu/x/2024/notes/0/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/0/lecture0.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/0/lecture0.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/0/lang/en/lecture0.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/0/lang/en/lecture0.txt",
    "sectionId": 'section-1'
  },
  {
    "title": "Week 1: C",
    "description": "C. Source Code. Machine Code. Compiler. Correctness, Design, Style. Visual Studio Code. Syntax Highlighting. Escape Sequences. Header Files. Libraries. Manual Pages. Types. Conditionals. Variables. Loops. Linux. Graphical User Interface (GUI). Command-Line Interface (CLI). Constants. Comments. Pseudocode. Operators. Integer Overflow. Floating-Point Imprecision.",
    "tags": "c, programming, basics",
    "videoLink": "https://youtu.be/cwtpLIWylAw",
    "notes": "https://cs50.harvard.edu/x/2024/notes/1/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/1/lecture1.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/1/lecture1.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/1/lang/en/lecture1.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/1/lang/en/lecture1.txt",
    "sectionId": 'section-1'
  },
  {
    "title": "Week 2: Arrays",
    "description": "Preprocessing. Compiling. Assembling. Linking. Debugging. Arrays. Strings. Command-Line Arguments. Cryptography.",
    "tags": "arrays, c, algorithms",
    "videoLink": "https://youtu.be/jZzyERW7h1A",
    "notes": "https://cs50.harvard.edu/x/2024/notes/2/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/2/lecture2.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/2/lecture2.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/2/lang/en/lecture2.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/2/lang/en/lecture2.txt",
    "sectionId": 'section-1'
  },
  {
    "title": "Week 3: Algorithms",
    "description": "Algorithm analysis, sorting algorithms, and searching algorithms.",
    "tags": "algorithms, sorting, searching, big-o",
    "videoLink": "https://youtu.be/2xelQcGDFrY",
    "notes": "https://cs50.harvard.edu/x/2024/notes/3/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/3/lecture3.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/3/lecture3.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/3/lang/en/lecture3.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/3/lang/en/lecture3.txt",
    "sectionId": 'section-2'
  },
  {
    "title": "Week 4: Memory",
    "description": "Pointers. Segmentation Faults. Dynamic Memory Allocation. Stack. Heap. Buffer Overflow. File I/O. Images.",
    "tags": "memory, pointers, c, data structures",
    "videoLink": "https://youtu.be/F9-yqoS7b8w",
    "notes": "https://cs50.harvard.edu/x/2024/notes/4/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/4/lecture4.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/4/lecture4.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/4/lang/en/lecture4.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/4/lang/en/lecture4.txt",
    "sectionId": 'section-2'
  },
  {
    "title": "Week 5: Data Structures",
    "description": "Abstract Data Types. Queues, Stacks. Linked Lists. Trees, Binary Search Trees. Hash Tables. Tries.",
    "tags": "data structures, linked lists, hash tables, tries",
    "videoLink": "https://youtu.be/0euvEdPwQnQ",
    "notes": "https://cs50.harvard.edu/x/2024/notes/5/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/5/lecture5.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/5/lecture5.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/5/lang/en/lecture5.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/5/lang/en/lecture5.txt",
    "sectionId": 'section-2'
  },
  {
    "title": "Week 6: Python",
    "description": "Python: Functions, Arguments, Return Values; Variables; Boolean Expressions, Conditionals; Loops. Modules, Packages.",
    "tags": "python, programming",
    "videoLink": "https://youtu.be/EHi0RDZ31VA",
    "notes": "https://cs50.harvard.edu/x/2024/notes/6/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/6/lecture6.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/6/lecture6.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/6/lang/en/lecture6.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/6/lang/en/lecture6.txt",
    "sectionId": 'section-3'
  },
  {
    "title": "Week 6.5: Artificial Intelligence",
    "description": "Prompt Engineering. System Prompt. User Prompt. Generative Artificial Intelligence. Artificial Intelligence. Decision Trees. Minimax. Machine Learning. Reinforcement Learning. Explore vs. Exploit. Deep Learning. Neural Networks. Large Language Models. Transformer Architecture. Hallucinations.",
    "videoLink": "https://youtu.be/6X58aP7yXC4",
    "notes": "https://cs50.harvard.edu/x/2024/notes/ai/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/ai/lectureai.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/ai/lectureai.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/ai/lang/en/lectureai.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/ai/lang/en/lectureai.txt",
    "sectionId": 'section-3'
  },
  {
    "title": "Week 7: SQL",
    "description": "SQL: Tables; Types; Statements; Constraints; Indexes; Keywords, Functions; Transactions. Race Conditionals. SQL Injection Attacks.",
    "tags": "sql, databases, relational databases",
    "videoLink": "https://youtu.be/1RCMYG8RUSE",
    "notes": "https://cs50.harvard.edu/x/2024/notes/7/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/7/lecture7.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/7/lecture7.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/7/lang/en/lecture7.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/7/lang/en/lecture7.txt",
    "sectionId": 'section-3'
  },
  {
    "title": "Week 8: HTML, CSS, JavaScript",
    "description": "Internet: Routers; TCP/IP; DNS. HTTP: URLs, GET, POST. HTML: Tags; Attributes. Servers. CSS: Properties; Selectors. Frameworks. JavaScript: Variables; Conditionals; Loops. Events.",
    "tags": "html, css, javascript, web",
    "videoLink": "https://youtu.be/ciz2UaifaNM",
    "notes": "https://cs50.harvard.edu/x/2024/notes/8/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/8/lecture8.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/8/lecture8.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/8/lang/en/lecture8.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/8/lang/en/lecture8.txt",
    "sectionId": 'section-4'
  },
  {
    "title": "Week 9: Flask",
    "description": "Flask. Route. Decorators. Requests, Responses. Sessions. Cookies.",
    "tags": "flask, python, web development, backend",
    "videoLink": "https://youtu.be/-aqUek49iL8",
    "notes": "https://cs50.harvard.edu/x/2024/notes/9/",
    "audioLink": "https://cdn.cs50.net/2023/fall/lectures/9/lecture9.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/lectures/9/lecture9.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/lectures/9/lang/en/lecture9.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/lectures/9/lang/en/lecture9.txt",
    "sectionId": 'section-5'
  },
  {
    "title": "Week 10: Cybersecurity",
    "description": "Passwords. Brute-Force Attacks. Password Managers. Two-Factor Authentication. One-Time Passwords. Hashing. Rainbow Table. Salting. Cryptography. Secret-Key Cryptography. Symmetric Cryptography. Asymmentric Cryptography. Public-Key Cryptography. HTTPS. Passkeys. End-to-End Encryption. Deletion. Secure Deletion. Full-Disk Encryption. Ransomware.",
    "tags": "cybersecurity, security, privacy",
    "videoLink": "https://youtu.be/EKof-cJiTG8",
    "notes": "https://cs50.harvard.edu/x/2024/notes/cybersecurity/",
    "audioLink": "https://cdn.cs50.net/2023/fall/cybersecurity/cybersecurity.mp3",
    "slides": "https://cdn.cs50.net/2023/fall/cybersecurity/cybersecurity.pdf",
    "subtitles": "https://cdn.cs50.net/2023/fall/cybersecurity/10/lang/en/cybersecurity.srt",
    "transcript": "https://cdn.cs50.net/2023/fall/cybersecurity/10/lang/en/cybersecurity.txt",
    "sectionId": 'section-5'
  },
]

const lectureResources = {
	"lecture-1": {
		"shorts": {
			"Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/0/src0/",
		},
		"psets": {
			"Problem Set 0": "https://cs50.harvard.edu/x/2024/psets/0/"
		}
	},
  "lecture-2": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/1/src1/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/1/",
      "Data Types": "https://cs50.harvard.edu/x/2024/shorts/data_types",
      "Operators": "https://cs50.harvard.edu/x/2024/shorts/operators",
      "Conditional Statements": "https://cs50.harvard.edu/x/2024/shorts/conditional_statements",
      "Loops": "https://cs50.harvard.edu/x/2024/shorts/loops",
      "Command Line": "https://cs50.harvard.edu/x/2024/shorts/command_line",
      "Magic Numbers": "https://cs50.harvard.edu/x/2024/shorts/magic_numbers"
    },
    "psets": {
      "Problem Set 1": "https://cs50.harvard.edu/x/2024/psets/1/"
    }
  },
  "lecture-3": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/2/src2/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/2/",
      "Functions": "https://cs50.harvard.edu/x/2024/shorts/functions",
      "Variables and Scope": "https://cs50.harvard.edu/x/2024/shorts/variables_and_scope",
      "Debugging ('Step through')": "https://cs50.harvard.edu/x/2024/shorts/debugging_step_through",
      "Debugging ('Step into')": "https://cs50.harvard.edu/x/2024/shorts/debugging_step_into",
      "Arrays": "https://cs50.harvard.edu/x/2024/shorts/arrays",
      "Command Line Arguments": "https://cs50.harvard.edu/x/2024/shorts/command_line_arguments"
    },
    "psets": {
      "Problem Set 2": "https://cs50.harvard.edu/x/2024/psets/2/"
    }
  },
  "lecture-4": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/3/src3/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/3/",
      "Linear Search": "https://cs50.harvard.edu/x/2024/shorts/linear_search",
      "Binary Search": "https://cs50.harvard.edu/x/2024/shorts/binary_search",
      "Bubble Sort": "https://cs50.harvard.edu/x/2024/shorts/bubble_sort",
      "Selection Sort": "https://cs50.harvard.edu/x/2024/shorts/selection_sort",
      "Recursion": "https://cs50.harvard.edu/x/2024/shorts/recursion",
      "Merge Sort": "https://cs50.harvard.edu/x/2024/shorts/merge_sort"
    },
    "psets": {
      "Problem Set 3": "https://cs50.harvard.edu/x/2024/psets/3/"
    }
  },
  "lecture-5": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/4/src4/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/4/",
      "Hexadecimal": "https://cs50.harvard.edu/x/2024/shorts/hexadecimal",
      "Pointers": "https://cs50.harvard.edu/x/2024/shorts/pointers",
      "Defining Custom Types": "https://cs50.harvard.edu/x/2024/shorts/defining_custom_types",
      "Dynamic Memory Allocation": "https://cs50.harvard.edu/x/2024/shorts/dynamic_memory_allocation",
      "Call Stacks": "https://cs50.harvard.edu/x/2024/shorts/call_stacks",
      "File Pointers": "https://cs50.harvard.edu/x/2024/shorts/file_pointers"
    },
    "psets": {
      "Problem Set 4": "https://cs50.harvard.edu/x/2024/psets/4/"
    }
  },
  "lecture-6": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/5/src5/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/5/",
      "Data Structures": "https://cs50.harvard.edu/x/2024/shorts/data_structures",
      "Structures": "https://cs50.harvard.edu/x/2024/shorts/structures",
      "Singly-Linked Lists": "https://cs50.harvard.edu/x/2024/shorts/singly_linked_lists",
      "Doubly-Linked Lists": "https://cs50.harvard.edu/x/2024/shorts/doubly_linked_lists",
      "Hash Tables": "https://cs50.harvard.edu/x/2024/shorts/hash_tables",
      "Tries": "https://cs50.harvard.edu/x/2024/shorts/tries",
      "Queues": "https://cs50.harvard.edu/x/2024/shorts/queues",
      "Stacks": "https://cs50.harvard.edu/x/2024/shorts/stacks"
    },
		"psets": {
      "Problem Set 5": "https://cs50.harvard.edu/x/2024/psets/5/"
    }

  },
  "lecture-7": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/6/src6/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/6/",
      "Python": "https://cs50.harvard.edu/x/2024/shorts/python"
    },
    "psets": {
      "Problem Set 6": "https://cs50.harvard.edu/x/2024/psets/6/"
    }
  },
  "lecture-8": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/ai/src",
    },
  },
  "lecture-9": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/7/src7/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/7/",
      "SQL": "https://cs50.harvard.edu/x/2024/shorts/sql"
    },
    "psets": {
      "Problem Set 7": "https://cs50.harvard.edu/x/2024/psets/7/"
    }
  },
  "lecture-10": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/8/src8/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/8/",
      "Internet Primer": "https://cs50.harvard.edu/x/2024/shorts/internet_primer",
      "IP": "https://cs50.harvard.edu/x/2024/shorts/ip",
      "TCP": "https://cs50.harvard.edu/x/2024/shorts/tcp",
      "HTTP": "https://cs50.harvard.edu/x/2024/shorts/http",
      "HTML": "https://cs50.harvard.edu/x/2024/shorts/html",
      "CSS": "https://cs50.harvard.edu/x/2024/shorts/css",
      "JavaScript": "https://cs50.harvard.edu/x/2024/shorts/javascript",
      "DOM": "https://cs50.harvard.edu/x/2024/shorts/dom"
    },
    "demos": {
      "Bingo Board, by Shoshana Promer, Yale ’26": "https://cdn.cs50.net/2023/fall/lectures/8/bingo.pdf",
      "Harvard Says ‘WE SUCK’": "https://youtu.be/jjR0nsb9Kmw",
      "Passing TCP/IP Packet": "https://youtu.be/cUJlRNRguAM"
    },
    "psets": {
      "Problem Set 8": "https://cs50.harvard.edu/x/2024/psets/8/"
    }
  },
	"lecture-11": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/9/src9/",
      "Section": "https://cs50.harvard.edu/x/2024/sections/9/",
      "Flask": "https://cs50.harvard.edu/x/2024/shorts/flask"
    },
    "psets": {
      "Problem Set 9": "https://cs50.harvard.edu/x/2024/psets/9/"
    }
  },
  "lecture-12": {
    "shorts": {
      "Source Code Index": "https://cdn.cs50.net/2023/fall/lectures/cybersecurity/src/",
			"Seminars": "https://cs50.harvard.edu/x/2024/seminars"
    },
    "psets": {
      "Final Project": "https://cs50.harvard.edu/x/2024/project/"
    }
  }
}

const users = [
  { id: 'test-user', email: 'test', firstName: 'Test', lastName: 'User', username: 'testuser', img: 'https://mighty.tools/mockmind-api/content/cartoon/11.jpg' },
  { id: 'user-1', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', username: 'johndoe', img: 'https://mighty.tools/mockmind-api/content/cartoon/27.jpg' },
  { id: 'user-2', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', username: 'janesmith', img: 'https://mighty.tools/mockmind-api/content/human/126.jpg' },
  { id: 'user-3', email: 'alice.johnson@example.com', firstName: 'Alice', lastName: 'Johnson', username: 'alicejohnson', img: 'https://mighty.tools/mockmind-api/content/cartoon/27.jpg' },
  { id: 'user-4', email: 'bob.brown@example.com', firstName: 'Bob', lastName: 'Brown', username: 'bobbrown', img: 'https://mighty.tools/mockmind-api/content/human/102.jpg' },
  { id: 'user-5', email: 'carol.williams@example.com', firstName: 'Carol', lastName: 'Williams', username: 'carolwilliams', img: 'https://mighty.tools/mockmind-api/content/human/129.jpg' }
];

const questions = {
  "lecture-1": [{"title":"Why use Scratch for CS50?","body":"<p>I've heard of Scratch before, but why does CS50 start with it? Isn't it too simple for a college-level course?</p>","userId":"user-1","upvotes":42},{"title":"Understanding loops in Scratch","body":"<p>I get the idea of loops in other languages, but Scratch makes it look so different. How does the <strong>forever loop</strong> compare to a \"while\" loop in Python?</p>","userId":"user-2","upvotes":27},{"title":"Favorite Scratch projects?","body":"<p>What were some of your favorite projects while learning Scratch? I tried making a simple game where a cat dodges falling apples 🍏🍎 but it's kinda buggy.</p>","userId":"user-3","upvotes":33},{"title":"Scratch seems too easy... or is it?","body":"<p>At first, I thought Scratch was for kids. But as I played around, I realized there’s actually a lot you can do. Does anyone else feel like this?</p>","userId":"user-4","upvotes":18},{"title":"Debugging in Scratch","body":"<p>How do you guys debug Scratch projects? It feels harder than just reading error messages like in Python.</p>","userId":"user-5","upvotes":25},{"title":"Understanding events in Scratch","body":"<p>Events in Scratch seem cool but also kinda weird. Like, why does \"when green flag clicked\" sometimes not do what I expect?</p>","userId":"user-2","upvotes":21},{"title":"Scratch vs. Real Coding","body":"<p>Scratch is fun, but I’m excited to get to real coding. How long do we stay in Scratch before moving on?</p>","userId":"user-1","upvotes":30},{"title":"Lists in Scratch","body":"<p>Are lists in Scratch like arrays in other languages? Can I sort them?</p>","userId":"user-3","upvotes":12}],
  "lecture-2": [{"title":"Why does C use semicolons?","body":"<p>I'm coming from Python, and it feels weird having to add \";\" at the end of every line. Why is this necessary in C?</p>","userId":"user-1","upvotes":37},{"title":"Best way to understand pointers?","body":"<p>Pointers are really confusing to me. <strong>Why do we need them?</strong> If I just pass variables normally, isn't that enough?</p><p>Any good resources or ways to think about this?</p>","userId":"user-2","upvotes":45},{"title":"Compiling with clang","body":"<p>Sometimes when I compile my code with \"clang\", I get warnings even if the code runs fine. Should I always fix these, or can I ignore them?</p>","userId":"user-3","upvotes":29},{"title":"Why do we need \"#include\"?","body":"<p>In Python, we just import stuff, but in C we have to use \"#include\". What's the difference? And why do we use \"stdio.h\" so often?</p>","userId":"user-4","upvotes":24},{"title":"Segmentation fault?!","body":"<p>Help! I keep getting \"Segmentation fault (core dumped)\" and I have no idea what I did wrong. How do I even debug this?</p>","userId":"user-5","upvotes":50},{"title":"\"printf\" vs. \"puts\"","body":"<p>I've seen both \"printf\" and \"puts\" being used to print text. Is there a reason to use one over the other?</p>","userId":"user-2","upvotes":19},{"title":"Memory in C","body":"<p>I've heard that in C, you have to manage memory manually. Does this mean that if I forget to free memory, my program will just keep using more and more?</p>","userId":"user-1","upvotes":41},{"title":"What does \"return 0\" do?","body":"<p>At the end of \"main\", we usually write \"return 0;\". What happens if we don't include it?</p>","userId":"user-3","upvotes":15}],
  "lecture-3": [{"title":"Why are arrays zero-indexed?","body":"<p>In C, arrays start at index \"0\". But why? Wouldn't it make more sense to start at \"1\"? Is this just a historical thing, or is there a technical reason?</p>","userId":"user-1","upvotes":34},{"title":"Be careful with array bounds!","body":"<p>I spent an hour debugging just to realize I was accessing \"numbers[5]\" in an array of size 5. No error message, no warning—just broken behavior.</p><p>Is there any way to make C warn me when I do this?</p>","userId":"user-2","upvotes":41},{"title":"What's inside an uninitialized array?","body":"<p>If I declare an array like this:</p><pre>\"int numbers[5];\"</pre><p>and I don’t assign values, what’s actually inside \"numbers\"? Garbage values? Zeroes? Does it depend on the compiler?</p>","userId":"user-3","upvotes":27},{"title":"Passing arrays to functions is weird","body":"<p>So when I pass an array to a function, I'm actually passing a pointer? Does that mean changes inside the function affect the original array?</p><p>Why doesn’t C just pass the whole array like it does with integers?</p>","userId":"user-4","upvotes":30},{"title":"Can I resize an array?","body":"<p>What if I create an array but later realize I need more space? Can I resize it, or do I have to create a new one and copy everything over?</p>","userId":"user-2","upvotes":35},{"title":"2D Arrays vs. Arrays of Arrays","body":"<p>I'm trying to understand how 2D arrays work. Are they actually just arrays of arrays, or is there something special about them in memory?</p>","userId":"user-5","upvotes":18},{"title":"Finding the length of an array","body":"<p>In Python, we just use \"len()\", but in C, it’s not that simple. What’s the best way to find the length of an array? Do we just have to keep track of it manually?</p>","userId":"user-1","upvotes":31},{"title":"Strings are just arrays?!","body":"<p>Wait... so in C, strings are actually just character arrays? That means \"\"hello\"\" and \"{'h', 'e', 'l', 'l', 'o', '\\0'}\" are basically the same?</p><p>Also, why do we need that \"'\\0'\" at the end?</p>","userId":"user-3","upvotes":29},{"title":"Working with arrays in loops","body":"<p>Using \"for\" loops with arrays is straightforward, but does anyone have a trick to avoid off-by-one errors? I keep messing up the loop condition and either skipping the last element or going out of bounds.</p>","userId":"user-4","upvotes":22}],
  "lecture-4": [{"title":"Bubble Sort is so slow...","body":"<p>Okay, I get it—Bubble Sort is easy to understand, but it's painfully slow. Why do we even learn it? Do people actually use it for anything?</p>","userId":"user-1","upvotes":42},{"title":"Binary search is mind-blowing","body":"<p>Seriously, cutting the problem in half each time is so much faster than going through everything one by one. <strong>Are there any real-world applications where this is super useful?</strong></p>","userId":"user-2","upvotes":35},{"title":"Big O Notation Explained Simply?","body":"<p>I understand <em>what</em> Big O is, but I still struggle with knowing how to determine the complexity of an algorithm. Any tips on making this easier?</p>","userId":"user-3","upvotes":47},{"title":"Selection Sort vs. Insertion Sort","body":"<p>Both have \"O(n^2)\" time complexity, but which one is actually better in practice? Is one faster for smaller datasets?</p>","userId":"user-4","upvotes":29},{"title":"Recursion is messing with my brain","body":"<p>I feel like I understand recursion when I see examples, but when I try to write my own recursive functions, I get lost. How do you guys think about recursion?</p>","userId":"user-5","upvotes":50},{"title":"Why does Merge Sort need extra space?","body":"<p>Merge Sort is \"O(n log n)\", which is great, but I heard it needs extra space. What does that mean, and why does it matter?</p>","userId":"user-1","upvotes":31},{"title":"Best sorting algorithm for real-world use?","body":"<p>If I'm writing a real-world application, like sorting user data, which sorting algorithm should I use? I assume not Bubble Sort 😂.</p>","userId":"user-2","upvotes":38},{"title":"Linear search vs. Binary search","body":"<p>Binary search is obviously faster, but when would you actually use linear search instead? Are there cases where it's the better choice?</p>","userId":"user-3","upvotes":22},{"title":"Sorting built into languages","body":"<p>Most programming languages have built-in sorting functions. What algorithm do they actually use behind the scenes?</p>","userId":"user-4","upvotes":27},{"title":"Hashing vs. Sorting","body":"<p>Would using a hash table ever be better than sorting? If I just need to check if something exists in a dataset, should I even bother sorting it?</p>","userId":"user-5","upvotes":33}],
  "lecture-5": [{"title":"What actually is a pointer?","body":"<p>Okay, so I get that pointers store memory addresses, but what does that \"*\" actually do? And why do we need \"&\"?</p>","userId":"user-1","upvotes":39},{"title":"Segmentation faults... again","body":"<p>Every time I think I understand pointers, I get another \"segmentation fault (core dumped)\". Any debugging tips?</p>","userId":"user-2","upvotes":47},{"title":"Stack vs. Heap","body":"<p>What’s the real difference between the stack and the heap? I know one is for function calls and one is for dynamic memory, but how do I decide which one to use?</p>","userId":"user-3","upvotes":30},{"title":"Why do we need to free memory?","body":"<p>In Python, we don’t worry about freeing memory. Why do we have to do it manually in C? What happens if I forget?</p>","userId":"user-4","upvotes":52},{"title":"How does \"malloc\" work?","body":"<p>I know that \"malloc\" allocates memory, but how does it actually decide where to put the new block of memory?</p>","userId":"user-5","upvotes":28},{"title":"Pointer arithmetic is weird","body":"<p>Adding numbers to pointers moves them by the size of the type? Why does \"ptr + 1\" not just go to the next byte?</p>","userId":"user-1","upvotes":33},{"title":"Memory leaks 😭","body":"<p>How do I check if my program has a memory leak? And if it does, how do I find where the leak is happening?</p>","userId":"user-2","upvotes":45},{"title":"Double freeing memory","body":"<p>I accidentally called \"free()\" on the same pointer twice, and now my program crashes. Why is that a problem?</p>","userId":"user-3","upvotes":21},{"title":"Valgrind is a lifesaver","body":"<p>Just started using Valgrind to check for memory leaks... I had no idea my code was leaking memory everywhere 😬.</p>","userId":"user-4","upvotes":37},{"title":"How does memory get fragmented?","body":"<p>I read that constantly allocating and freeing memory can cause fragmentation. How bad is this in real programs?</p>","userId":"user-5","upvotes":26}],
  "lecture-6": [{"title":"Linked lists vs. arrays","body":"<p>Okay, I get that linked lists don’t have a fixed size like arrays, but if I just need to store a bunch of stuff, why not always use an array?</p>","userId":"user-1","upvotes":40},{"title":"Pointers inside structs","body":"<p>Why do we sometimes store pointers inside structs instead of just storing the actual values? Is it just to save memory?</p>","userId":"user-2","upvotes":31},{"title":"When should I use a stack?","body":"<p>I understand how a stack works (LIFO, push/pop), but when would I actually use one in a real program?</p>","userId":"user-3","upvotes":28},{"title":"Queues are underrated","body":"<p>Everyone talks about stacks, but queues are just as useful. Ever tried implementing a job scheduler? You’d definitely need a queue.</p>","userId":"user-4","upvotes":35},{"title":"How does a hash table work?","body":"<p>I know hash tables store key-value pairs, but how do they actually find things so fast? And what happens if two keys hash to the same spot?</p>","userId":"user-5","upvotes":48},{"title":"Singly vs. Doubly Linked Lists","body":"<p>Is there ever a situation where a singly linked list is better than a doubly linked list? Seems like having both \"next\" and \"prev\" is just more convenient.</p>","userId":"user-1","upvotes":27},{"title":"Binary trees are confusing","body":"<p>How do I know when to use a binary tree instead of just an array or linked list? Is it only for searching?</p>","userId":"user-2","upvotes":39},{"title":"Why not always use hash tables?","body":"<p>Hash tables seem crazy fast, so why don’t we just use them for everything?</p>","userId":"user-3","upvotes":30},{"title":"Memory usage of different structures","body":"<p>Which data structure generally uses the most memory? I assume linked lists use more than arrays because of all the pointers?</p>","userId":"user-4","upvotes":22},{"title":"Real-world examples of trees","body":"<p>What are some real-world applications of trees? I keep hearing about them, but where are they actually used?</p>","userId":"user-5","upvotes":42}],
  "lecture-7": [{"title":"Python feels so much easier than C","body":"<p>Not having to worry about memory allocation or pointers is such a relief. <strong>Why didn't we just start with Python?</strong></p>","userId":"user-1","upvotes":52},{"title":"Indentation instead of braces?","body":"<p>It feels weird not using curly braces for loops and functions. <em>Does this ever cause issues?</em></p>","userId":"user-2","upvotes":34},{"title":"List vs. Tuple","body":"<p>What’s the actual difference between a list and a tuple? When should I use one over the other?</p>","userId":"user-3","upvotes":27},{"title":"Why is Python slower than C?","body":"<p>Python is way easier to write, but I heard it's much slower than C. What makes it slow? Is it just because it’s interpreted?</p>","userId":"user-4","upvotes":39},{"title":"Dictionaries are magic","body":"<p>Okay, so Python dictionaries work like hash tables? But they seem so easy to use compared to what we learned in C. What’s happening behind the scenes?</p>","userId":"user-5","upvotes":45},{"title":"Can Python do everything C can?","body":"<p>Is there anything C can do that Python just <strong>can't</strong> do? Or is it just a matter of speed?</p>","userId":"user-1","upvotes":30},{"title":"For loops are weirdly powerful","body":"<p>In C, loops are very explicit. But in Python, you can do stuff like:</p><pre>\"for x in range(10):\"</pre><p>or even loop through a list directly. Feels odd but also kinda cool.</p>","userId":"user-2","upvotes":37},{"title":"What's up with \"None\"?","body":"<p>In C, we have \"NULL\", but in Python, it’s \"None\". Is it the same thing?</p>","userId":"user-3","upvotes":22},{"title":"Duck typing is wild","body":"<p>So in Python, you don’t have to declare variable types? Just assign \"x = 5\" and it figures it out? This feels way too easy...</p>","userId":"user-4","upvotes":40},{"title":"I keep forgetting colons","body":"<p>Every time I write a function or loop, I forget to put a \":\" at the end and get a syntax error. Just me?</p>","userId":"user-5","upvotes":28}],
  "lecture-8": [{"title":"AI is just math?","body":"<p>So is AI basically just a bunch of math and probability? I thought it was something more... I don’t know, futuristic?</p>","userId":"user-1","upvotes":47},{"title":"Neural networks sound like magic","body":"<p>We just give them data, and they <em>learn</em>? I get the basics, but how do they actually adjust themselves?</p>","userId":"user-2","upvotes":38},{"title":"How does a model know when it's \"good enough\"?","body":"<p>When training a machine learning model, how do we know when to stop? Do we just keep tweaking it until it looks right?</p>","userId":"user-3","upvotes":31},{"title":"AI vs. regular programming","body":"<p>Traditional programming: <strong>explicit rules</strong>. AI: <strong>find patterns</strong>. So does this mean AI will replace normal programming someday?</p>","userId":"user-4","upvotes":56},{"title":"Bias in AI","body":"<p>I've heard that AI can be biased. But if it's just learning from data, isn’t the real problem the data we give it?</p>","userId":"user-5","upvotes":42},{"title":"What’s the difference between AI and ML?","body":"<p>People use these terms interchangeably, but what’s the actual difference? Is ML just a subset of AI?</p>","userId":"user-1","upvotes":36},{"title":"Training a model takes forever","body":"<p>I'm running a small neural network on my laptop and it's taking <em>forever</em>. How do companies train massive models?</p>","userId":"user-2","upvotes":29},{"title":"AI in games","body":"<p>Can AI be used to make video game NPCs smarter? Or is that a different kind of AI?</p>","userId":"user-3","upvotes":33},{"title":"Ethical concerns in AI","body":"<p>Deepfakes, misinformation, surveillance… AI is powerful, but how do we make sure it's used ethically?</p>","userId":"user-4","upvotes":50},{"title":"Will AI take our jobs?","body":"<p>Be honest, is AI going to replace programmers? Or will we just have to adapt and work alongside it?</p>","userId":"user-5","upvotes":49}],
  "lecture-9": [{"title":"SQL is surprisingly easy... but also not","body":"<p>Honestly, I thought databases would be way more complicated, but writing queries feels pretty natural. Until I tried a JOIN, then my brain broke. 😵‍💫</p>","userId":"user-1","upvotes":53},{"title":"Forgot a semicolon... again","body":"<p>Why do I keep forgetting to put a \";\" at the end of my SQL statements? Is there a setting somewhere that just adds it for me? 😅</p>","userId":"user-2","upvotes":42},{"title":"Why do we even need foreign keys?","body":"<p>I get that foreign keys help with relationships, but my table works fine without them. What actual problems will I run into if I don’t use them?</p>","userId":"user-3","upvotes":36},{"title":"My SELECT query is slow...","body":"<p>So I tried running \"SELECT * FROM large_table\" and it took forever. Is there a way to make queries faster? Or should I just never use \"*\"?</p>","userId":"user-4","upvotes":48},{"title":"SQL Injection is scary","body":"<p>Okay, the part about SQL injection blew my mind. Someone could just type \"' OR '1'='1\" and break into my database?! Never trusting \"input()\" again. 😬</p>","userId":"user-5","upvotes":61},{"title":"Why does NULL exist?","body":"<p>NULL is messing with my queries. I thought \"NULL = NULL\" would be true, but it’s not? What’s the logic behind that?</p>","userId":"user-1","upvotes":33},{"title":"Why is GROUP BY so tricky?","body":"<p>GROUP BY made sense in the lecture, but when I tried using it in my own query, I kept getting errors. Is there some rule I’m missing?</p>","userId":"user-2","upvotes":37},{"title":"Normalization is making my brain hurt","body":"<p>Okay, so normalization helps avoid redundancy, but now my data is split into so many tables I can barely keep track of it. How do real companies handle this?</p>","userId":"user-3","upvotes":44},{"title":"Indexes are a cheat code","body":"<p>I added an index to my table, and my query went from 10 seconds to <strong>almost instant</strong>. Why wouldn’t I just index everything?</p>","userId":"user-4","upvotes":39},{"title":"SQL vs. spreadsheets","body":"<p>Spreadsheets let me store data too, so why use SQL instead? When does it make sense to switch from Excel to a real database?</p>","userId":"user-5","upvotes":46}],
  "lecture-10": [{"title":"HTML was easy... then CSS happened","body":"<p>Making a webpage with HTML was simple. But then I tried CSS and suddenly everything is either <em>too close together</em> or <em>floating off the screen</em>. 🤦‍♂️</p>","userId":"user-1","upvotes":57},{"title":"Why is CSS so inconsistent?","body":"<p>Margins, padding, display types... I feel like I need a PhD just to center a div. Is there an easy way to learn this?</p>","userId":"user-2","upvotes":49},{"title":"Inline, internal, external CSS?","body":"<p>The lecture showed three ways to write CSS: inline, internal, and external. Is there ever a reason to use inline styles, or is that just bad practice?</p>","userId":"user-3","upvotes":38},{"title":"Why does JavaScript use \"var\", \"let\", and \"const\"?","body":"<p>Why do we need three different ways to declare variables in JavaScript? Can’t we just pick one?</p>","userId":"user-4","upvotes":45},{"title":"CSS Grid vs. Flexbox","body":"<p>Both Grid and Flexbox help with layouts, but when should I use one over the other?</p>","userId":"user-5","upvotes":40},{"title":"JavaScript runs... but how?","body":"<p>Unlike C, we don’t need to compile JavaScript. But what actually happens when the browser runs our code?</p>","userId":"user-1","upvotes":42},{"title":"Positioning elements is painful","body":"<p>Static, relative, absolute, fixed… why are there so many positioning options in CSS? And why does \"position: absolute;\" make things disappear? 😵‍💫</p>","userId":"user-2","upvotes":51},{"title":"How does JavaScript interact with HTML?","body":"<p>The \"document.querySelector()\" method lets us grab elements, but how does JavaScript actually <strong>change</strong> the page?</p>","userId":"user-3","upvotes":36},{"title":"JavaScript is weirdly powerful","body":"<p>I thought JavaScript was just for making buttons work, but it can also fetch data, modify styles, and even build games??</p>","userId":"user-4","upvotes":48},{"title":"CSS animations are awesome","body":"<p>I tried adding \"@keyframes\" to my site, and it looks way more professional now. What’s the easiest way to make smooth animations?</p>","userId":"user-5","upvotes":43}],
  "lecture-11": [{"title":"Flask is simpler than I expected","body":"<p>Honestly, I thought setting up a web server would be way harder. Just a few lines of Python and boom, a website? 🔥</p>","userId":"user-1","upvotes":52},{"title":"Why do we need routes?","body":"<p>Okay, so Flask uses \"@app.route()\" to map URLs to functions. But why can't we just put all our logic in one place?</p>","userId":"user-2","upvotes":41},{"title":"Templates are kinda confusing","body":"<p>I get that Flask uses Jinja for templates, but mixing HTML with \"{{ curly braces }}\" feels weird. Does this get easier?</p>","userId":"user-3","upvotes":37},{"title":"Where does Flask actually run?","body":"<p>When I start my Flask app, it says 'Running on http://127.0.0.1:5000/'. So is this an actual web server, or just for testing?</p>","userId":"user-4","upvotes":46},{"title":"Why do we use \"render_template\"?","body":"<p>Why not just return a big string of HTML from the Python function instead of using \"render_template()\"? Is there a performance reason?</p>","userId":"user-5","upvotes":39},{"title":"Flask vs Django?","body":"<p>Flask is lightweight, but Django is full-featured. If I want to build a real project, which one should I pick?</p>","userId":"user-1","upvotes":48},{"title":"Forms are tricky","body":"<p>So I added a form to my site, but how do I process the data when someone submits it? Do I always need \"request.form\"?</p>","userId":"user-2","upvotes":34},{"title":"Flask + Databases","body":"<p>Flask by itself doesn’t come with a database, so what’s the best way to connect it to one? SQLAlchemy?</p>","userId":"user-3","upvotes":43},{"title":"Static files and Flask","body":"<p>Where should I put my CSS and JavaScript files? I saw something about a \"static/\" folder, but do I have to use that?</p>","userId":"user-4","upvotes":38},{"title":"How do I deploy Flask?","body":"<p>It works on my local machine, but how do I put my Flask app on the internet so other people can access it?</p>","userId":"user-5","upvotes":50}],
  "lecture-12": [{"title":"I feel like nothing is safe","body":"<p>After this lecture, I’m questioning everything. My passwords, my emails, my entire digital life. 😬</p>","userId":"user-1","upvotes":64},{"title":"How do hackers actually guess passwords?","body":"<p>Brute force, dictionary attacks, rainbow tables… so many ways to break weak passwords. How do websites actually prevent this?</p>","userId":"user-2","upvotes":53},{"title":"Is public Wi-Fi really that dangerous?","body":"<p>The lecture mentioned 'man-in-the-middle' attacks on public Wi-Fi. Does this mean I should never use free Wi-Fi again?</p>","userId":"user-3","upvotes":47},{"title":"Two-factor authentication is a must","body":"<p>After seeing how easy it is to steal passwords, I’m enabling 2FA on everything. Everyone should do this!</p>","userId":"user-4","upvotes":58},{"title":"What’s the best way to store passwords?","body":"<p>Sites shouldn’t store raw passwords, but even hashing can be attacked. What’s the most secure way to store user credentials?</p>","userId":"user-5","upvotes":49},{"title":"Phishing is scary","body":"<p>I always thought phishing emails were obvious, but now I see how sneaky they can be. How do you spot the really advanced ones?</p>","userId":"user-1","upvotes":55},{"title":"How do firewalls actually work?","body":"<p>I hear about firewalls all the time, but what do they actually do? Do they just block traffic, or is there more to it?</p>","userId":"user-2","upvotes":42},{"title":"Encryption is insane","body":"<p>Knowing that modern encryption would take billions of years to break makes me feel safe. But what happens if quantum computers change that?</p>","userId":"user-3","upvotes":50},{"title":"What’s the best way to secure a website?","body":"<p>If I build a Flask site, what are the key things I should do to prevent attacks? SQL injection, XSS, CSRF… there’s so much to think about.</p>","userId":"user-4","upvotes":44},{"title":"The dark web is real??","body":"<p>I always thought 'the dark web' was just a myth, but now I see how Tor works. Has anyone actually used it? (for legal reasons, just curious 🤨)</p>","userId":"user-5","upvotes":60}],
};


const generalQuestions = [{"title":"Is CS50 too hard for beginners?","body":"<p>I had zero coding experience before this course, and honestly, some parts feel overwhelming. Did anyone else struggle at first?</p>","userId":"user-1","upvotes":73},{"title":"Best way to take notes for CS50?","body":"<p>There’s so much information in each lecture. Do you guys take notes, or just rewatch when needed?</p>","userId":"user-2","upvotes":52},{"title":"What’s the best CS50 problem set?","body":"<p>I just finished a few problem sets, and I love the real-world applications. Which problem set was your favorite?</p>","userId":"user-3","upvotes":61},{"title":"How do you stay motivated?","body":"<p>Some problem sets take <strong>hours</strong>. How do you all keep pushing through when things get frustrating?</p>","userId":"user-4","upvotes":66},{"title":"Do I need a strong math background for CS50?","body":"<p>Some parts of the course mention algorithms and Big O notation. Do I need to be good at math to really understand this?</p>","userId":"user-5","upvotes":47},{"title":"What’s after CS50?","body":"<p>Once I finish CS50, what’s the next step? Should I take CS50 AI, CS50 Web, or start working on my own projects?</p>","userId":"user-1","upvotes":58},{"title":"Best text editor for CS50?","body":"<p>CS50 IDE is great, but should I switch to VS Code or something else for larger projects?</p>","userId":"user-2","upvotes":39},{"title":"I finally understand pointers!","body":"<p>It took me way too long, but I finally get pointers. Feels like a major milestone in my programming journey. 😃</p>","userId":"user-3","upvotes":75},{"title":"How do I debug efficiently?","body":"<p>I spend more time debugging than actually writing code. What are your best debugging strategies?</p>","userId":"user-4","upvotes":54},{"title":"What was the hardest topic in CS50?","body":"<p>For me, it was definitely memory management and pointers. What topic gave you the most trouble?</p>","userId":"user-5","upvotes":63},{"title":"Does CS50 prepare you for a real job?","body":"<p>After completing CS50, do you feel ready for real-world coding? Or is this just the foundation?</p>","userId":"user-1","upvotes":50},{"title":"How do I build my first real project?","body":"<p>Now that I know Python, C, SQL, and Flask… where do I start if I want to build my own web app?</p>","userId":"user-2","upvotes":45},{"title":"CS50 lectures vs problem sets","body":"<p>Is it just me, or do the problem sets feel way harder than the lectures make them seem? How do you bridge the gap?</p>","userId":"user-3","upvotes":60},{"title":"How much time should I spend on CS50?","body":"<p>How many hours per week do you all put into this course? I feel like I’m spending way more time than expected.</p>","userId":"user-4","upvotes":57},{"title":"CS50 made me love coding","body":"<p>Not gonna lie, I took this course just to try programming, and now I think I want to switch careers. Anyone else feel this way?</p>","userId":"user-5","upvotes":78},{"title":"What’s the best way to practice coding?","body":"<p>Besides problem sets, what are some good ways to get better at coding? Should I be doing LeetCode or something?</p>","userId":"user-1","upvotes":55},{"title":"Why is C still used today?","body":"<p>With Python and JavaScript being so popular, why do we still learn C? Do people actually use it for real-world projects?</p>","userId":"user-2","upvotes":49},{"title":"Group projects in CS50?","body":"<p>Has anyone tried doing the problem sets with a study group? Does it help, or is it better to struggle through alone?</p>","userId":"user-3","upvotes":44},{"title":"Best YouTube channels for learning to code?","body":"<p>Sometimes I need extra explanations outside of the lectures. Any good YouTube recommendations?</p>","userId":"user-4","upvotes":53},{"title":"CS50 final project ideas?","body":"<p>I want to build something cool for the final project, but I have no idea what. What are some good ideas?</p>","userId":"user-5","upvotes":65}];

const mockReplies = [
  {"userId":"user-1","body":"Mock Reply: Great question! I was wondering the same thing.","upvotes":23},
  {"userId":"user-2","body":"Mock Reply: It took me a while to get this concept, but rewatching the lecture helped a lot.","upvotes":17},
  {"userId":"user-3","body":"Mock Reply: Have you tried looking at the documentation? Sometimes it explains things better.","upvotes":31},
  {"userId":"user-4","body":"Mock Reply: Interesting point! I never thought about it that way.","upvotes":20},
  {"userId":"user-5","body":"Mock Reply: Yep, this part was confusing at first, but after practicing, it started making sense.","upvotes":29},
  {"userId":"user-1","body":"Mock Reply: Anyone else struggling with this? Maybe we can figure it out together.","upvotes":14}
];

const announcements = [
  {
    "title": "🚀 Welcome to CS50!",
    "body": "<p>The journey begins! CS50 is more than just a course—it's a challenge. Expect to struggle, expect to learn, and most importantly, expect to grow.</p><p>Need help? Engage in discussions, ask questions, and push yourself.</p><p>Let’s get started! 💡</p>",
    "commentsCount": 15
  },
  {
    "title": "📅 Problem Set Deadlines",
    "body": "<p>Reminder: The deadline for the next problem set is coming up soon! Make sure to submit it on time.</p><p>If you’re stuck, check out the forum or rewatch the lecture.</p>",
    "commentsCount": 18
  },
  {
    "title": "🎉 CS50 Fair is Coming!",
    "body": "<p>Exciting news! The CS50 Fair is an opportunity to showcase your final projects. Whether you're building a web app, game, or AI model, this is your moment.</p><p><img src='https://seas.harvard.edu/sites/default/files/styles/embedded_image_large/public/image_3.jpg?itok=ULYJEW7I' /></p><p>Start brainstorming now! 🚀</p>",
    "commentsCount": 12
  },
  {
    "title": "💡 Tip: Debugging Like a Pro",
    "body": "<p>Stuck on a problem? Don’t panic! Try these steps:</p><ul><li>Use <code>printf()</code> or <code>console.log()</code> to track values.</li><li>Break your code into smaller parts.</li><li>Explain your problem to a rubber duck. Seriously, it helps!</li></ul><p>What debugging tricks do you use?</p>",
    "commentsCount": 14
  },
  {
    "title": "📣 New Lecture Available!",
    "body": "<p>Lecture 6.5 on Artificial Intelligence is now live! This session dives into how AI works, how we train models, and its real-world applications.</p><p><img src='https://i.ytimg.com/vi/1HuD2ryeOLg/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvE7HtxCJSLobanlJUhzKG3JpVqg' /></p><p>Check it out and let us know what you think!</p>",
    "commentsCount": 20
  },
  {
    "title": "📢 Office Hours This Week",
    "body": "<p>Need extra help? Join our virtual office hours where TAs will be available to answer your questions live!</p><p>Times: Wednesday & Friday at 3:00 PM (EST)</p><p>Bring your questions, no matter how big or small! 😊</p>",
    "commentsCount": 11
  },
  {
    "title": "🔥 CS50 Challenge: Code a Mini Project!",
    "body": "<p>Challenge yourself! Try building a mini project based on what you’ve learned so far.</p><p>Ideas: a simple to-do app, a text-based adventure game, or a number guessing game.</p><p>Post your projects in the forum!</p>",
    "commentsCount": 17
  },
  {
    "title": "📝 CS50 Final Project Guide",
    "body": "<p>Feeling stuck on your final project idea? Here’s what you need:</p><ul><li>Pick something YOU are excited about.</li><li>Start small, then expand.</li><li>Ask for feedback in the forum.</li></ul><p>Need inspiration? Check out past CS50 projects! <a href='https://cs50.harvard.edu/x/2025/gallery/'> Here</a></p>",
    "commentsCount": 13
  },
  {
    "title": "⏳ How to Stay on Track in CS50",
    "body": "<p>CS50 moves fast! Here’s how to keep up:</p><ul><li>Set aside dedicated coding time.</li><li>Don’t be afraid to ask for help.</li><li>Stay consistent—even 30 mins a day helps.</li></ul><p>How do you stay on top of CS50?</p>",
    "commentsCount": 19
  },
  {
    "title": "🔗 Useful CS50 Resources",
    "body": "<p>Bookmark these!</p><ul><li><a href='https://cs50.harvard.edu/x/'>Official CS50 Website</a></li><li><a href='https://cs50.harvard.edu/python/'>CS50 Python</a></li><li><a href='https://edx.org'>EdX Course Page</a></li></ul><p>What other resources do you use?</p>",
    "commentsCount": 16
  }
]

const comments = [
  {"userId":"user-1","body":"Mock Comment: This is super helpful! Thanks for sharing."},
  {"userId":"user-2","body":"Mock Comment: Excited for this! Looking forward to it."},
  {"userId":"user-3","body":"Mock Comment: Does anyone have more details on this?"},
  {"userId":"user-4","body":"Mock Comment: Just what I needed to hear today!"},
  {"userId":"user-5","body":"Mock Comment: I almost forgot about this, thanks for the reminder!"},
  {"userId":"user-1","body":"Mock Comment: Can't wait to try this out!"},
  {"userId":"user-2","body":"Mock Comment: This is exactly what I was struggling with."},
  {"userId":"user-3","body":"Mock Comment: I’ll definitely check this out, thanks!"},
  {"userId":"user-4","body":"Mock Comment: Anyone else excited for this?"},
  {"userId":"user-5","body":"Mock Comment: Wow, this is going to be fun!"},
  {"userId":"user-1","body":"Mock Comment: I need to go back and rewatch that part."},
  {"userId":"user-2","body":"Mock Comment: So useful! I wish I had known this earlier."},
  {"userId":"user-3","body":"Mock Comment: Great reminder, I need to stay on track."},
  {"userId":"user-4","body":"Mock Comment: This looks interesting!"},
  {"userId":"user-5","body":"Mock Comment: Love the motivation here!"}
]

module.exports = {
  lectures,
  lectureResources,
  users,
  questions,
  generalQuestions,
	mockSections,
  mockReplies,
  comments,
  announcements
};

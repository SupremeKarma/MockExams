# Programming in C (BIT101)
**Semester**: 1 | **Credits**: 3

---

## 1. Core Code Algorithms & Practical Implementations

### 1.1 Pointers, Dynamic Memory & Memory Addresses [Priority: Very High]
**Key Concepts & Exam Notes:**
- Pointer stores hexadecimal address of another variable (* dereference, & address-of)
- Dynamic allocation via malloc(), calloc(), realloc(), and free() in <stdlib.h>
- Dangling pointers occur when referencing deallocated heap memory
- Pointer arithmetic: ptr + 1 advances by sizeof(data_type) bytes

```cpp
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));
    if (!arr) return 1;
    for(int i = 0; i < 5; i++) *(arr + i) = (i + 1) * 10;
    for(int i = 0; i < 5; i++) printf("%d ", *(arr + i));
    free(arr);
    return 0;
}
```

---

### 1.2 Structures, Unions & Bit-Fields [Priority: High]
**Key Concepts & Exam Notes:**
- Structure members each have their own memory; union members share the largest member's memory
- struct size is affected by byte padding and memory alignment
- Access members using dot operator (.) for values and arrow operator (->) for pointers

```cpp
#include <stdio.h>

struct Student {
    int id;
    char name[30];
    float gpa;
};

int main() {
    struct Student s1 = {101, "Aarav Sharma", 3.85};
    struct Student *ptr = &s1;
    printf("Student: %s, GPA: %.2f\n", ptr->name, ptr->gpa);
    return 0;
}
```

---

## 2. High-Frequency Theory Questions & University Solutions

### Q1: Explain different storage classes in C (auto, register, static, extern) with scope and lifetime.
> **University Exam Solution Guide**: High-frequency recurring topic for Purbanchal University assessments. Structure your answer with clear definitions, architecture diagram/state flow, and key points.

### Q2: Describe recursive functions with memory stack activation record diagrams.
> **University Exam Solution Guide**: High-frequency recurring topic for Purbanchal University assessments. Structure your answer with clear definitions, architecture diagram/state flow, and key points.

### Q3: What are file handling modes in C? Explain fopen, fread, fwrite, fclose.
> **University Exam Solution Guide**: High-frequency recurring topic for Purbanchal University assessments. Structure your answer with clear definitions, architecture diagram/state flow, and key points.

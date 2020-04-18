' File: array.vbs
'
' Demonstrate very basic array functionality.

Option Explicit

dim i, j                      ' to be used for subscripting arrays

dim A(10)                     ' A has 11 elements: A(0) to A(10)
for i = 0 to 6
   A(i) = 2 * i 
next

' notice there are only have 6 entries in a size 11 array
call printOneArray(A, "This is the A Array")

dim B
B = Array(11, 22, 33, 44)
' This is the same as:  dim B(3) with setting 
'    B(0) = 11
'    B(1) = 22
'    B(2) = 33
'    B(3) = 44
call printOneArray(B, "This is the B Array")

' C is a 2-dimensional array, with 3 rows and 4 columns
' The first subscript is the row, second is column, 
' e.g., C(1,2) is the element in row 1, column 2
dim C(2, 3)
for i = 0 to 2
   for j = 0 to 3
      C(i,j) = i + j 
   next
next
call printTwoDArray(C, "This is the C Array")


'----------------------------------------------------------------------------
' printOneArray
' Takes in 2 input parameters, the array to display and a string which 
' is a description of what is displayed to be used as the MsgBox title. 
' It displays the contents of the array in message box titled description.
SUB printOneArray(ByRef myArray, ByRef description)
   dim output, i
   output = ""
   For i = 0 to UBound(myArray)
      output = output & "myArray(" & i & ") = " & myArray(i) & vbNewLine
   next

   ' concatenate lower and upper bound of the array
   output = output & "Array Lower Bound: " & LBound(myArray) & vbNewLine
   output = output & "Array Upper Bound: " & UBound(myArray) & vbNewLine

   MsgBox output, ,description
end SUB


'----------------------------------------------------------------------------
' printTwoDArray
' Takes in 2 input parameters, the 2D array to display and a string which 
' is a description of what is displayed to be used as the MsgBox title. 
' It displays the contents of the array in message box titled description.
SUB printTwoDArray(ByRef myArray, ByRef description)
   dim output, i, j
   output = ""
   for i = 0 to UBound(myArray, 1)
      for j = 0 to UBound(myArray, 2)
         output = output & "myArray(" & i & "," & j &") = " & _
                            myArray(i,j) & vbNewLine
      next
      output = output & vbNewLine
   next

   ' concatenate lower and upper bound of the array
   ' second parameter of LBound or UBound is the dimension
   output = output & "Array Row Lower Bound: " & LBound(myArray, 1) & vbNewLine
   output = output & "Array Row Upper Bound: " & UBound(myArray, 1) & vbNewLine
   output = output & "Array Col Lower Bound: " & LBound(myArray, 2) & vbNewLine
   output = output & "Array Col Upper Bound: " & UBound(myArray, 2) & vbNewLine

   MsgBox output, ,description
end SUB


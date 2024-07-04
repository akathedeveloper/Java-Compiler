
import java.util.Scanner;    
public class Solution{  
     public static void main(String args[]){  
      int i,fact=1;  
      Scanner sc = new Scanner(System.in);  
    int x = sc.nextInt();  
   
      for(i=1;i<=x;i++){    
          fact=fact*i;    
      }    
      System.out.println("Factorial of "+x+" is: "+fact);    
     }  
    }  
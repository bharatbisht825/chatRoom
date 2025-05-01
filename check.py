nums=[1,1,2]
count=0
curr=0
while(curr<len(nums)-1):
    if(nums[curr]>nums[curr+1]):
        break
    if(nums[curr]==nums[curr+1]):
        swapLoc=curr+1
        for i in range(swapLoc+1,len(nums)):
            if(nums[swapLoc]>nums[i]):
                break
            else:
                nums[swapLoc],nums[i]=nums[i],nums[swapLoc]
                swapLoc+=1
    else:
        curr+=1
        count+=1
print( count)

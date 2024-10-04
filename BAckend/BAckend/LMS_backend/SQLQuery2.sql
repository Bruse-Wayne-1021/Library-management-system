SELECT TOP (1000) [Id]
      ,[Title]
      ,[Publisher]
      ,[BookCopies]
      ,[Isbn]
  FROM [LMS_Database].[dbo].[Books]


  Insert into LMS_Database ([Title],[Publisher],[BookCopies],[Isbn])
  values
  ("harry potter","jk",12,2)
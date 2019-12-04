class AnswersController < ApplicationController
    def index
        answers = Answer.all 
        render json: answers
    end
    
    
    def create
        answer = Answer.create(question: params[:question], user_id: params[:user_id], correct: params[:correct])
        render json: answer
    end

end
